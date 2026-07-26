-- Crear tabla de usuarios
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de medidas
CREATE TABLE public.measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  pecho TEXT DEFAULT '',
  cintura TEXT DEFAULT '',
  cadera TEXT DEFAULT '',
  hombros TEXT DEFAULT '',
  manga TEXT DEFAULT '',
  entrepierna TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- Crear tabla de prendas
CREATE TABLE public.garments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  size TEXT NOT NULL,
  type TEXT NOT NULL,
  model TEXT,
  photo_url TEXT,
  ref_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejor rendimiento
CREATE INDEX idx_measurements_user_id ON public.measurements(user_id);
CREATE INDEX idx_garments_user_id ON public.garments(user_id);
CREATE INDEX idx_garments_brand ON public.garments(brand);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.garments ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
-- Usuarios solo pueden ver su propio perfil
CREATE POLICY "Usuarios ven su propio perfil"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Usuarios pueden actualizar su propio perfil
CREATE POLICY "Usuarios actualizan su propio perfil"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Usuarios solo pueden ver sus medidas
CREATE POLICY "Usuarios ven sus medidas"
  ON public.measurements
  FOR SELECT
  USING (auth.uid() = user_id);

-- Usuarios pueden actualizar sus medidas
CREATE POLICY "Usuarios actualizan sus medidas"
  ON public.measurements
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Usuarios solo pueden ver sus prendas
CREATE POLICY "Usuarios ven sus prendas"
  ON public.garments
  FOR SELECT
  USING (auth.uid() = user_id);

-- Usuarios pueden insertar sus prendas
CREATE POLICY "Usuarios insertan sus prendas"
  ON public.garments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuarios pueden actualizar sus prendas
CREATE POLICY "Usuarios actualizan sus prendas"
  ON public.garments
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Usuarios pueden eliminar sus prendas
CREATE POLICY "Usuarios eliminan sus prendas"
  ON public.garments
  FOR DELETE
  USING (auth.uid() = user_id);
