import { supabase } from './supabase'

export interface Garment {
  id: string
  name: string
  brand: string
  size: string
  type: string
  model?: string
  photo?: string
  refActive: boolean
}

export interface Measurements {
  pecho: string
  cintura: string
  cadera: string
  hombros: string
  manga: string
  entrepierna: string
}

// ===== PRENDAS =====

/**
 * Obtiene todas las prendas del usuario
 */
export async function getUserGarments(userId: string): Promise<Garment[]> {
  try {
    const { data, error } = await supabase
      .from('garments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return (data || []).map((garment) => ({
      id: garment.id,
      name: garment.name,
      brand: garment.brand,
      size: garment.size,
      type: garment.type,
      model: garment.model,
      photo: garment.photo_url,
      refActive: garment.ref_active,
    }))
  } catch (error) {
    console.error('Error obteniendo prendas:', error)
    return []
  }
}

/**
 * Añade una nueva prenda
 */
export async function addGarment(
  userId: string,
  garment: Omit<Garment, 'id'>
): Promise<Garment | null> {
  try {
    const { data, error } = await supabase
      .from('garments')
      .insert([
        {
          user_id: userId,
          name: garment.name,
          brand: garment.brand,
          size: garment.size,
          type: garment.type,
          model: garment.model,
          photo_url: garment.photo,
          ref_active: garment.refActive,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      name: data.name,
      brand: data.brand,
      size: data.size,
      type: data.type,
      model: data.model,
      photo: data.photo_url,
      refActive: data.ref_active,
    }
  } catch (error) {
    console.error('Error añadiendo prenda:', error)
    return null
  }
}

/**
 * Actualiza una prenda
 */
export async function updateGarment(
  garmentId: string,
  updates: Partial<Garment>
): Promise<Garment | null> {
  try {
    const { data, error } = await supabase
      .from('garments')
      .update({
        name: updates.name,
        brand: updates.brand,
        size: updates.size,
        type: updates.type,
        model: updates.model,
        photo_url: updates.photo,
        ref_active: updates.refActive,
      })
      .eq('id', garmentId)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      name: data.name,
      brand: data.brand,
      size: data.size,
      type: data.type,
      model: data.model,
      photo: data.photo_url,
      refActive: data.ref_active,
    }
  } catch (error) {
    console.error('Error actualizando prenda:', error)
    return null
  }
}

/**
 * Elimina una prenda
 */
export async function deleteGarment(garmentId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('garments')
      .delete()
      .eq('id', garmentId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error eliminando prenda:', error)
    return false
  }
}

// ===== MEDIDAS =====

/**
 * Obtiene las medidas del usuario
 */
export async function getUserMeasurements(userId: string): Promise<Measurements | null> {
  try {
    const { data, error } = await supabase
      .from('measurements')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) throw error

    return {
      pecho: data.pecho,
      cintura: data.cintura,
      cadera: data.cadera,
      hombros: data.hombros,
      manga: data.manga,
      entrepierna: data.entrepierna,
    }
  } catch (error) {
    console.error('Error obteniendo medidas:', error)
    return null
  }
}

/**
 * Actualiza las medidas del usuario
 */
export async function updateUserMeasurements(
  userId: string,
  measurements: Measurements
): Promise<Measurements | null> {
  try {
    const { data, error } = await supabase
      .from('measurements')
      .update(measurements)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error

    return {
      pecho: data.pecho,
      cintura: data.cintura,
      cadera: data.cadera,
      hombros: data.hombros,
      manga: data.manga,
      entrepierna: data.entrepierna,
    }
  } catch (error) {
    console.error('Error actualizando medidas:', error)
    return null
  }
}

// ===== USUARIO =====

/**
 * Obtiene el perfil del usuario
 */
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error obteniendo perfil:', error)
    return null
  }
}

/**
 * Actualiza el perfil del usuario
 */
export async function updateUserProfile(
  userId: string,
  updates: { name?: string }
): Promise<boolean> {
  try {
    const { error } = await supabase.from('users').update(updates).eq('id', userId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error actualizando perfil:', error)
    return false
  }
}
