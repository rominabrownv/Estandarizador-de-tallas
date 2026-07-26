import { useState, useEffect } from 'react'
import { AuthUser, registerUser, loginUser, logoutUser, getCurrentUser, onAuthStateChange } from '../services/auth'
import { Garment, Measurements, getUserGarments, addGarment as dbAddGarment, updateGarment as dbUpdateGarment, deleteGarment as dbDeleteGarment, getUserMeasurements, updateUserMeasurements as dbUpdateMeasurements } from '../services/database'

interface UseSupabaseState {
  user: AuthUser | null
  loading: boolean
  error: string
}

interface UseSupabaseReturn extends UseSupabaseState {
  register: (email: string, password: string, name: string) => Promise<boolean>
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  garments: Garment[]
  measurements: Measurements
  addGarment: (garment: Omit<Garment, 'id'>) => Promise<Garment | null>
  updateGarment: (id: string, updates: Partial<Garment>) => Promise<Garment | null>
  deleteGarment: (id: string) => Promise<boolean>
  updateMeasurements: (measurements: Measurements) => Promise<Measurements | null>
}

/**
 * Hook personalizado para manejar toda la lógica de Supabase
 * Integra autenticación, prendas y medidas en un solo lugar
 */
export function useSupabase(): UseSupabaseReturn {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [garments, setGarments] = useState<Garment[]>([])
  const [measurements, setMeasurements] = useState<Measurements>({
    pecho: '',
    cintura: '',
    cadera: '',
    hombros: '',
    manga: '',
    entrepierna: '',
  })

  // Cargar usuario actual y escuchar cambios de auth
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true)
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      setLoading(false)
    }

    loadUser()

    const subscription = onAuthStateChange((authUser) => {
      setUser(authUser)
      if (!authUser) {
        setGarments([])
        setMeasurements({
          pecho: '',
          cintura: '',
          cadera: '',
          hombros: '',
          manga: '',
          entrepierna: '',
        })
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  // Cargar prendas cuando el usuario cambia
  useEffect(() => {
    const loadGarments = async () => {
      if (!user) {
        setGarments([])
        return
      }
      const userGarments = await getUserGarments(user.id)
      setGarments(userGarments)
    }
    loadGarments()
  }, [user])

  // Cargar medidas cuando el usuario cambia
  useEffect(() => {
    const loadMeasurements = async () => {
      if (!user) {
        setMeasurements({
          pecho: '',
          cintura: '',
          cadera: '',
          hombros: '',
          manga: '',
          entrepierna: '',
        })
        return
      }
      const userMeasurements = await getUserMeasurements(user.id)
      if (userMeasurements) {
        setMeasurements(userMeasurements)
      }
    }
    loadMeasurements()
  }, [user])

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setError('')
      const { user: newUser, error: regError } = await registerUser(email, password, name)
      if (regError) {
        setError(regError)
        return false
      }
      if (newUser) {
        setUser(newUser)
        return true
      }
      return false
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error de registro'
      setError(errorMsg)
      return false
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setError('')
      const { user: loginUser, error: loginError } = await loginUser(email, password)
      if (loginError) {
        setError(loginError)
        return false
      }
      if (loginUser) {
        setUser(loginUser)
        return true
      }
      return false
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error de login'
      setError(errorMsg)
      return false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      setError('')
      const { error: logoutError } = await logoutUser()
      if (logoutError) {
        setError(logoutError)
      } else {
        setUser(null)
        setGarments([])
        setMeasurements({
          pecho: '',
          cintura: '',
          cadera: '',
          hombros: '',
          manga: '',
          entrepierna: '',
        })
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error de logout'
      setError(errorMsg)
    }
  }

  const addGarment = async (garment: Omit<Garment, 'id'>): Promise<Garment | null> => {
    if (!user) return null
    try {
      setError('')
      const newGarment = await dbAddGarment(user.id, garment)
      if (newGarment) {
        setGarments([newGarment, ...garments])
      }
      return newGarment
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al añadir prenda'
      setError(errorMsg)
      return null
    }
  }

  const updateGarment = async (id: string, updates: Partial<Garment>): Promise<Garment | null> => {
    try {
      setError('')
      const updated = await dbUpdateGarment(id, updates)
      if (updated) {
        setGarments(garments.map((g) => (g.id === id ? updated : g)))
      }
      return updated
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al actualizar prenda'
      setError(errorMsg)
      return null
    }
  }

  const deleteGarment = async (id: string): Promise<boolean> => {
    try {
      setError('')
      const success = await dbDeleteGarment(id)
      if (success) {
        setGarments(garments.filter((g) => g.id !== id))
      }
      return success
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al eliminar prenda'
      setError(errorMsg)
      return false
    }
  }

  const updateMeasurements = async (newMeasurements: Measurements): Promise<Measurements | null> => {
    if (!user) return null
    try {
      setError('')
      const updated = await dbUpdateMeasurements(user.id, newMeasurements)
      if (updated) {
        setMeasurements(updated)
      }
      return updated
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al actualizar medidas'
      setError(errorMsg)
      return null
    }
  }

  return {
    user,
    loading,
    error,
    garments,
    measurements,
    register,
    login,
    logout,
    addGarment,
    updateGarment,
    deleteGarment,
    updateMeasurements,
  }
}
