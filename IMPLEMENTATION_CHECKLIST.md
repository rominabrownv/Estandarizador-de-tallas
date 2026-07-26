## 📋 Checklist de Implementación

Sigue estos pasos para completar la migración a Supabase.

### ✅ Fase 1: Preparación (5 min)

- [ ] Crear cuenta en [supabase.com](https://supabase.com)
- [ ] Crear nuevo proyecto
- [ ] Copiar URL del proyecto
- [ ] Copiar clave anónima (anon public)
- [ ] Crear archivo `.env.local` (copiar de `.env.example`)
- [ ] Pegar credenciales en `.env.local`

### ✅ Fase 2: Base de Datos (5 min)

- [ ] Abrir Supabase Dashboard → SQL Editor
- [ ] Crear Nueva Query
- [ ] Copiar todo el contenido de `SUPABASE_SCHEMA.sql`
- [ ] Pegar en el editor
- [ ] Ejecutar (Ctrl+Enter)
- [ ] Verificar que no hay errores
- [ ] Ir a Table Editor y verificar que existen las tablas:
  - [ ] `users`
  - [ ] `measurements`
  - [ ] `garments`

### ✅ Fase 3: Autenticación (10 min)

- [ ] En Supabase Dashboard → Authentication → Providers
- [ ] Verificar que "Email" está habilitado
- [ ] Ir a Settings → Email Templates (opcional, pero recomendado)
- [ ] Personalizar plantillas si lo deseas

### ✅ Fase 4: Integración del Código (15-30 min)

Elige UNA opción:

#### Opción A: Usar el Hook (⭐ Recomendado)
- [ ] Leer `MIGRATION_GUIDE.md`
- [ ] En `App.tsx`, importar `useSupabase`:
  ```typescript
  import { useSupabase } from './hooks/useSupabase'
  ```
- [ ] En el componente, usar el hook:
  ```typescript
  const { user, loading, garments, login, register, logout } = useSupabase()
  ```
- [ ] Reemplazar todas las funciones de localStorage
- [ ] Reemplazar todos los `setState` de prendas/medidas

#### Opción B: Refactorización Gradual
- [ ] Leer `MIGRATION_GUIDE.md` paso a paso
- [ ] Cambiar autenticación primero
- [ ] Luego cambiar prendas
- [ ] Luego cambiar medidas
- [ ] Probar cada parte

### ✅ Fase 5: Testing (10 min)

- [ ] Ejecutar `npm run dev`
- [ ] Crear nueva cuenta (registrarse)
- [ ] Verificar que se creó en Supabase (Database → users)
- [ ] Iniciar sesión
- [ ] Añadir una prenda
- [ ] Verificar que aparece en Supabase (Database → garments)
- [ ] Actualizar medidas
- [ ] Verificar en Supabase (Database → measurements)
- [ ] Cerrar sesión
- [ ] Iniciar sesión de nuevo
- [ ] Verificar que los datos persisten

### ✅ Fase 6: Limpieza (5 min)

- [ ] Eliminar funciones de localStorage de `App.tsx`:
  - `loadAccounts()`
  - `saveAccounts()`
  - `loadSession()`
  - `saveSession()`
  - `clearSession()`
- [ ] Eliminar constantes de `STORAGE_KEYS`
- [ ] Eliminar tipos y interfaces de `UserAccount` si ya no se usan
- [ ] Verificar que no hay referencias a `localStorage` en el código

### ✅ Fase 7: Optimizaciones (Opcional)

- [ ] Añadir manejo de errores mejorado
- [ ] Añadir loading states en la UI
- [ ] Implementar notificaciones/toasts
- [ ] Añadir offline mode (más avanzado)
- [ ] Configurar Realtime (sync automático)

### 🎯 Puntos Clave

1. **No borres el código viejo** hasta que todo funcione
2. **Prueba incrementalmente** - no cambies todo de una vez
3. **Verifica en Supabase Dashboard** que los datos llegan
4. **Lee los errores** en DevTools (F12) si algo no funciona
5. **Usa el hook `useSupabase`** para simplificar la integración

### 🚨 Problemas Comunes

**Error: "VITE_SUPABASE_URL not defined"**
- ✅ Solución: Reinicia `npm run dev` después de crear `.env.local`

**No se crea el usuario**
- ✅ Verifica que ejecutaste el SQL correctamente
- ✅ Revisa DevTools (F12) → Network → mira la respuesta

**Las prendas no se guardan**
- ✅ Verifica que iniciaste sesión correctamente
- ✅ Mira la consola del navegador (F12) para ver errores
- ✅ Verifica que la tabla `garments` existe

**Error de CORS**
- ✅ No necesitas configurar nada, Supabase maneja CORS
- ✅ Si persiste, ve a Supabase Settings → API

**¿Más problemas?**
- Ve a Supabase Dashboard → Logs
- Abre DevTools del navegador (F12)
- Lee los mensajes de error

---

## 📞 Ayuda Rápida

```
Comando para ver si todo está instalado:
npm ls @supabase/supabase-js

Comando para reiniciar servidor:
npm run dev

Para depuración:
- F12 en el navegador
- Busca errores en la consola
- Ve a Network para ver las llamadas a Supabase
```

---

**¿Completaste todos los pasos? ¡Felicidades! 🎉**  
Tu app ya está migrando datos a Supabase sin necesidad de backend.

**¿Algo no funciona?**  
Revisa la sección de "Problemas Comunes" o los archivos de documentación:
- `SUPABASE_SETUP.md` - Configuración
- `MIGRATION_GUIDE.md` - Cambios de código
- `INTEGRATION_EXAMPLES.md` - Ejemplos de uso
