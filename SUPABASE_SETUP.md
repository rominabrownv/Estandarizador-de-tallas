# 🚀 Guía de Configuración de Supabase

## 1️⃣ Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Haz clic en "New Project"
3. Ingresa los detalles:
   - **Project name**: `Estandarizador-de-tallas` (o el que prefieras)
   - **Database password**: Genera una contraseña fuerte
   - **Region**: Selecciona la más cercana (ej: `us-east-1`)
4. Espera a que se cree el proyecto (2-3 minutos)

## 2️⃣ Obtener Credenciales

1. Ve a **Settings** → **API** en tu proyecto
2. Copia:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`

## 3️⃣ Crear Variables de Entorno

1. Copia `.env.example` a `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edita `.env.local` y pega tus credenciales:
   ```
   VITE_SUPABASE_URL=https://xyzabc.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## 4️⃣ Ejecutar Script SQL

1. En Supabase Dashboard, ve a **SQL Editor**
2. Haz clic en **New Query**
3. Copia el contenido de `SUPABASE_SCHEMA.sql` completo
4. Pégalo en el editor
5. Haz clic en **Run** (o presiona `Ctrl+Enter`)
6. Espera a que termine (debe completarse sin errores)

## 5️⃣ Verificar Tablas

1. Ve a **Table Editor** en Supabase
2. Deberías ver estas tablas:
   - ✅ `users`
   - ✅ `measurements`
   - ✅ `garments`

## 6️⃣ Habilitar Email/Password Authentication

1. Ve a **Authentication** → **Providers**
2. Busca **Email** (debe estar habilitado por defecto)
3. Si no está, actívalo

## 7️⃣ Configurar CORS (Opcional, para desarrollo local)

1. Ve a **Settings** → **API**
2. En **URL Configuration**, añade tu URL local si es necesario

## 8️⃣ Reinicia tu servidor

```bash
npm run dev
```

## ✨ Listo

Tu app ahora se conectará a Supabase. Prueba:
- ✅ Registrarse
- ✅ Iniciar sesión
- ✅ Añadir prendas
- ✅ Actualizar medidas

---

## 🆘 Solución de Problemas

**Erro "Invalid API key"**
- Verifica que copiaste correctamente `VITE_SUPABASE_ANON_KEY`
- Reinicia el servidor (`npm run dev`)

**No puedo crear usuario**
- Verifica que la tabla `users` existe
- Ejecuta nuevamente el script SQL

**Las prendas no se guardan**
- Abre DevTools (F12) y ve la pestaña Network
- Verifica si hay errores de CORS
- Comprueba que las tablas tienen las políticas RLS correctas

**¿Necesitas help?**
- Verifica el archivo `src/services/supabase.ts` para ver la URL y clave
- Abre la consola del navegador (F12) para ver errores detallados
