import { useSupabase } from '../hooks/useSupabase'

/**
 * Ejemplo de cómo usar el hook useSupabase en componentes
 * Este archivo muestra los patrones de integración
 */

// ===== EJEMPLO 1: Mostrar usuario =====
export function UserProfile() {
  const { user, loading } = useSupabase()

  if (loading) return <div>Cargando...</div>

  if (!user) {
    return <div>No hay usuario autenticado</div>
  }

  return (
    <div>
      <h1>Hola, {user.name}</h1>
      <p>Email: {user.email}</p>
    </div>
  )
}

// ===== EJEMPLO 2: Listar prendas =====
export function GarmentsList() {
  const { garments, loading } = useSupabase()

  if (loading) return <div>Cargando prendas...</div>

  return (
    <div>
      <h2>Mis prendas ({garments.length})</h2>
      {garments.length === 0 ? (
        <p>No tienes prendas aún</p>
      ) : (
        <ul>
          {garments.map((garment) => (
            <li key={garment.id}>
              <strong>{garment.name}</strong> - {garment.brand} - Talla {garment.size}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ===== EJEMPLO 3: Añadir prenda =====
export function AddGarmentForm() {
  const { addGarment, error } = useSupabase()
  const [name, setName] = React.useState('')
  const [brand, setBrand] = React.useState('Zara')
  const [size, setSize] = React.useState('M')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const success = await addGarment({
      name,
      brand,
      size,
      type: 'Camiseta',
      refActive: true,
    })

    if (success) {
      setName('')
      alert('Prenda añadida exitosamente')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <select value={brand} onChange={(e) => setBrand(e.target.value)}>
        <option>Zara</option>
        <option>H&M</option>
        <option>Nike</option>
      </select>
      <select value={size} onChange={(e) => setSize(e.target.value)}>
        <option>XS</option>
        <option>S</option>
        <option>M</option>
        <option>L</option>
      </select>
      <button type="submit">Añadir prenda</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}

// ===== EJEMPLO 4: Login =====
export function LoginComponent() {
  const { login, error, loading } = useSupabase()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await login(email, password)
    if (success) {
      // Redirigir o cambiar pantalla
      console.log('Login exitoso')
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        Iniciar sesión
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}

// ===== EJEMPLO 5: Actualizar medidas =====
export function UpdateMeasurements() {
  const { measurements, updateMeasurements, error } = useSupabase()
  const [localMeasurements, setLocalMeasurements] = React.useState(measurements)

  React.useEffect(() => {
    setLocalMeasurements(measurements)
  }, [measurements])

  const handleUpdate = async () => {
    await updateMeasurements(localMeasurements)
  }

  return (
    <div>
      <h3>Mis medidas</h3>
      <div>
        <label>Pecho: </label>
        <input
          type="text"
          value={localMeasurements.pecho}
          onChange={(e) =>
            setLocalMeasurements({ ...localMeasurements, pecho: e.target.value })
          }
        />
      </div>
      <div>
        <label>Cintura: </label>
        <input
          type="text"
          value={localMeasurements.cintura}
          onChange={(e) =>
            setLocalMeasurements({ ...localMeasurements, cintura: e.target.value })
          }
        />
      </div>
      {/* Repetir para otras medidas */}
      <button onClick={handleUpdate}>Guardar medidas</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

// ===== EJEMPLO 6: Logout =====
export function LogoutButton() {
  const { logout } = useSupabase()

  const handleLogout = async () => {
    await logout()
    // Redirigir a splash/login
  }

  return <button onClick={handleLogout}>Cerrar sesión</button>
}
