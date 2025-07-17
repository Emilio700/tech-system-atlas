-- Completar la estructura de la tabla ProyectosPyansa para la aplicación
ALTER TABLE public."ProyectosPyansa" 
ADD COLUMN IF NOT EXISTS purpose TEXT,
ADD COLUMN IF NOT EXISTS connections JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS development_type VARCHAR(20) DEFAULT 'web' CHECK (development_type IN ('web', 'desktop', 'legacy')),
ADD COLUMN IF NOT EXISTS language VARCHAR(100),
ADD COLUMN IF NOT EXISTS database_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS diagram_url TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para updated_at
DROP TRIGGER IF EXISTS update_proyectos_updated_at ON public."ProyectosPyansa";
CREATE TRIGGER update_proyectos_updated_at 
    BEFORE UPDATE ON public."ProyectosPyansa"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security
ALTER TABLE public."ProyectosPyansa" ENABLE ROW LEVEL SECURITY;

-- Crear política permisiva para todos los usuarios autenticados
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public."ProyectosPyansa";
CREATE POLICY "Allow all operations for authenticated users" ON public."ProyectosPyansa"
FOR ALL TO authenticated USING (true) WITH CHECK (true);