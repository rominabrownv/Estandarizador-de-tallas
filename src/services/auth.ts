import { supabase } from './supabase'

export interface AuthUser {
  id: string
  email: string
  name: string
}

/**
 * Registra un nuevo usuario
 */
export async function registerUser(
  email: string,
  password: string,
  name: string
): Promise<{ user: AuthUser; error: null } | { user: null; error: string }> {
  try {
    // 1. Crear usuario en Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) throw new Error(authError.message)
    if (!authData.user) throw new Error('No se pudo crear el usuario')

    // 2. Crear registro en tabla users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,
          email,
          name,
        },
      ])
      .select()
      .single()

    if (userError) throw new Error(userError.message)

    // 3. Crear registro vacío de medidas
    const { error: measureError } = await supabase.from('measurements').insert([
      {
        user_id: authData.user.id,
        pecho: '',
        cintura: '',
        cadera: '',
        hombros: '',
        manga: '',
        entrepierna: '',
      },
    ])

    if (measureError) console.error('Error al crear medidas:', measureError)

    return {
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
      },
      error: null,
    }
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}

/**
 * Inicia sesión con email y contraseña
 */
export async function loginUser(
  email: string,
  password: string
): Promise<{ user: AuthUser; error: null } | { user: null; error: string }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw new Error(error.message)
    if (!data.user) throw new Error('No se pudo iniciar sesión')

    // Obtener datos del usuario
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (userError) throw new Error(userError.message)

    return {
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
      },
      error: null,
    }
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}

/**
 * Cierra la sesión actual
 */
export async function logoutUser(): Promise<{ error: null } | { error: string }> {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
    return { error: null }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}

/**
 * Obtiene el usuario actualmente autenticado
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) return null

    return {
      id: userData.id,
      email: userData.email,
      name: userData.name,
    }
  } catch {
    return null
  }
}

/**
 * Escucha cambios de autenticación
 */
export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const user = await getCurrentUser()
      callback(user)
    } else {
      callback(null)
    }
  })

  return subscription
}
