# 🔄 Guía de Migración de App.tsx a Supabase

## Cambios Principales en `src/app/App.tsx`

### 1. Reemplazar funciones de autenticación

**ANTES (localStorage):**
```typescript
function loadSession(): string | null {
  return localStorage.getItem(STORAGE_KEYS.session)
}

function saveSession(email: string) {
  localStorage.setItem(STORAGE_KEYS.session, email)
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.session)
}
```

**DESPUÉS (Supabase):**
```typescript
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  getCurrentUser,
  onAuthStateChange 
} from '../services/auth'
import { 
  getUserGarments, 
  addGarment as dbAddGarment,
  updateGarment as dbUpdateGarment,
  deleteGarment as dbDeleteGarment,
  getUserMeasurements,
  updateUserMeasurements as dbUpdateMeasurements
} from '../services/database'

// Usar las funciones de auth.ts directamente
```

---

### 2. Cambiar el manejo de estado del usuario

**ANTES:**
```typescript
const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
  const email = loadSession()
  if (!email) return null
  return loadAccounts().find((a) => a.email === email) ?? null
})

// En login:
const accounts = loadAccounts()
const newUser: UserAccount = {
  email,
  password: hashedPassword,
  name,
  garments: [],
  measurements: { pecho: "", cintura: "", ... }
}
saveAccounts([...accounts, newUser])
saveSession(email)
```

**DESPUÉS:**
```typescript
const [currentUser, setCurrentUser] = useState<{
  id: string
  email: string
  name: string
} | null>(null)

// Al montar el componente:
useEffect(() => {
  const loadUser = async () => {
    const user = await getCurrentUser()
    setCurrentUser(user)
  }
  loadUser()
  
  // Escuchar cambios de auth
  const subscription = onAuthStateChange(setCurrentUser)
  return () => subscription?.unsubscribe()
}, [])

// En login:
const { user, error } = await loginUser(email, password)
if (user) setCurrentUser(user)

// En logout:
await logoutUser()
setCurrentUser(null)
```

---

### 3. Cambiar la carga de prendas

**ANTES:**
```typescript
const [garments, setGarments] = useState<Garment[]>(() => {
  const email = loadSession()
  if (!email) return []
  return loadAccounts().find((a) => a.email === email)?.garments ?? []
})
```

**DESPUÉS:**
```typescript
const [garments, setGarments] = useState<Garment[]>([])

useEffect(() => {
  const loadGarments = async () => {
    if (!currentUser) return
    const userGarments = await getUserGarments(currentUser.id)
    setGarments(userGarments)
  }
  loadGarments()
}, [currentUser])
```

---

### 4. Cambiar la adición de prendas

**ANTES:**
```typescript
setGarments([
  ...garments,
  { id: Date.now().toString(), ...addForm }
])

const accounts = loadAccounts()
const userIdx = accounts.findIndex((a) => a.email === currentUser!.email)
accounts[userIdx].garments.push(newGarment)
saveAccounts(accounts)
```

**DESPUÉS:**
```typescript
const newGarment = await dbAddGarment(currentUser!.id, addForm)
if (newGarment) {
  setGarments([newGarment, ...garments])
}
```

---

### 5. Cambiar la actualización de prendas

**ANTES:**
```typescript
const updated = garments.map((g) =>
  g.id === garmentId ? { ...g, ...updates } : g
)
setGarments(updated)

// Guardar en localStorage
const accounts = loadAccounts()
const userIdx = accounts.findIndex((a) => a.email === currentUser!.email)
accounts[userIdx].garments = updated
saveAccounts(accounts)
```

**DESPUÉS:**
```typescript
const updated = await dbUpdateGarment(garmentId, updates)
if (updated) {
  setGarments(garments.map((g) => (g.id === garmentId ? updated : g)))
}
```

---

### 6. Cambiar la eliminación de prendas

**ANTES:**
```typescript
const filtered = garments.filter((g) => g.id !== garmentId)
setGarments(filtered)

// Guardar en localStorage
const accounts = loadAccounts()
const userIdx = accounts.findIndex((a) => a.email === currentUser!.email)
accounts[userIdx].garments = filtered
saveAccounts(accounts)
```

**DESPUÉS:**
```typescript
const success = await dbDeleteGarment(garmentId)
if (success) {
  setGarments(garments.filter((g) => g.id !== garmentId))
}
```

---

### 7. Cambiar el manejo de medidas

**ANTES:**
```typescript
const [measurements, setMeasurements] = useState(() => {
  const email = loadSession()
  if (!email) return DEFAULT_MEASUREMENTS
  return loadAccounts().find((a) => a.email === email)?.measurements ?? DEFAULT_MEASUREMENTS
})

// Actualizar:
setMeasurements(newMeasurements)
const accounts = loadAccounts()
const userIdx = accounts.findIndex((a) => a.email === currentUser!.email)
accounts[userIdx].measurements = newMeasurements
saveAccounts(accounts)
```

**DESPUÉS:**
```typescript
const [measurements, setMeasurements] = useState<Measurements>({
  pecho: "",
  cintura: "",
  cadera: "",
  hombros: "",
  manga: "",
  entrepierna: "",
})

useEffect(() => {
  const loadMeasurements = async () => {
    if (!currentUser) return
    const userMeasurements = await getUserMeasurements(currentUser.id)
    if (userMeasurements) setMeasurements(userMeasurements)
  }
  loadMeasurements()
}, [currentUser])

// Actualizar:
const updated = await dbUpdateMeasurements(currentUser.id, newMeasurements)
if (updated) setMeasurements(updated)
```

---

### 8. Cambiar el registro de usuarios

**ANTES:**
```typescript
const accounts = loadAccounts()
const newUser: UserAccount = {
  email,
  password: hashPassword(password),
  name,
  garments: [],
  measurements: DEFAULT_MEASUREMENTS
}
saveAccounts([...accounts, newUser])
saveSession(email)
setCurrentUser(newUser)
```

**DESPUÉS:**
```typescript
const { user, error } = await registerUser(email, password, name)
if (error) {
  setAuthError(error)
} else if (user) {
  setCurrentUser(user)
  setScreen("home")
}
```

---

## Resumen de Cambios

| Operación | localStorage | Supabase |
|-----------|--------------|----------|
| Obtener usuario | `loadSession()` + `loadAccounts()` | `getCurrentUser()` |
| Guardar sesión | `saveSession()` | `onAuthStateChange()` |
| Registrar | Crear objeto + `saveAccounts()` | `registerUser()` |
| Iniciar sesión | Buscar en array + `saveSession()` | `loginUser()` |
| Cerrar sesión | `clearSession()` | `logoutUser()` |
| Obtener prendas | `account.garments` | `getUserGarments()` |
| Añadir prenda | Push a array + `saveAccounts()` | `addGarment()` |
| Actualizar prenda | Map array + `saveAccounts()` | `updateGarment()` |
| Eliminar prenda | Filter array + `saveAccounts()` | `deleteGarment()` |
| Medidas | `account.measurements` | `getUserMeasurements()` |

---

## Ventajas de esta migración

✅ Datos persistentes en la nube  
✅ Sin código de backend  
✅ Autenticación segura  
✅ Acceso multi-dispositivo  
✅ Sincronización automática  
✅ Mejor escalabilidad  
✅ No limpio por borrar cookies  
