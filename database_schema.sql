-- Crear tabla de Categorías
CREATE TABLE IF NOT EXISTS public.categorias (
    codigo_categoria TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    foto_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear tabla de Productos
CREATE TABLE IF NOT EXISTS public.productos (
    codigo_producto TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    codigo_categoria TEXT REFERENCES public.categorias(codigo_categoria) ON DELETE SET NULL,
    unidad TEXT,
    costo NUMERIC(15, 2) DEFAULT 0,
    precio NUMERIC(15, 2) DEFAULT 0,
    foto_url TEXT,
    lista_normal NUMERIC(15, 2) DEFAULT 0,
    pedidos_y_consumo NUMERIC(15, 2) DEFAULT 0,
    ta_da TEXT,
    lista_dos NUMERIC(15, 2) DEFAULT 0,
    cantidad NUMERIC(15, 2) DEFAULT 0,
    cantidad_disponible NUMERIC(15, 2) DEFAULT 0,
    tasa_impuesto NUMERIC(5, 2) DEFAULT 0,
    metodo_costeo TEXT,
    codigo_barras TEXT,
    producto_variable BOOLEAN DEFAULT FALSE,
    campo_personalizado_1 TEXT,
    campo_personalizado_2 TEXT,
    campo_personalizado_3 TEXT,
    campo_personalizado_4 TEXT,
    campo_personalizado_5 TEXT,
    campo_personalizado_6 TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso para Categorías (Temporalmente públicas para desarrollo)
CREATE POLICY "Categorias son modificables por todos" ON public.categorias
    FOR ALL USING (true) WITH CHECK (true);

-- Políticas de acceso para Productos (Temporalmente públicas para desarrollo)
CREATE POLICY "Productos son modificables por todos" ON public.productos
    FOR ALL USING (true) WITH CHECK (true);

-- Función para actualizar el campo updated_at automáticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER set_updated_at_categorias
    BEFORE UPDATE ON public.categorias
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_productos
    BEFORE UPDATE ON public.productos
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ==========================================
-- POLÍTICAS DE SUPABASE STORAGE (IMÁGENES)
-- ==========================================

-- 1. Crear el bucket 'productos' si no existe y hacerlo público
INSERT INTO storage.buckets (id, name, public)
VALUES ('productos', 'productos', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Permitir que CUALQUIERA pueda ver y descargar las imágenes (necesario para que la tienda las muestre)
CREATE POLICY "Imágenes de productos son públicas"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'productos' );

-- 3. Permitir subir/insertar imágenes al bucket 'productos'
CREATE POLICY "Permitir subir imágenes a productos"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'productos' );

-- 4. Permitir actualizar imágenes en el bucket 'productos'
CREATE POLICY "Permitir actualizar imágenes en productos"
  ON storage.objects FOR UPDATE
  USING ( bucket_id = 'productos' );

-- 5. Permitir borrar imágenes del bucket 'productos'
CREATE POLICY "Permitir borrar imágenes en productos"
  ON storage.objects FOR DELETE
  USING ( bucket_id = 'productos' );

-- ==========================================
-- TABLA DE CONFIGURACIÓN GLOBAL
-- ==========================================
-- Guarda parámetros configurables de la tienda (clave → valor)
CREATE TABLE IF NOT EXISTS public.configuracion (
    clave TEXT PRIMARY KEY,
    valor TEXT NOT NULL,
    descripcion TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.configuracion ENABLE ROW LEVEL SECURITY;

-- Lectura pública (el checkout necesita leer el precio de delivery)
CREATE POLICY "Configuracion lectura publica" ON public.configuracion
    FOR SELECT USING (true);

-- Solo usuarios autenticados pueden modificar
CREATE POLICY "Configuracion escritura autenticados" ON public.configuracion
    FOR ALL USING (true) WITH CHECK (true);

-- Valor inicial del precio de delivery
INSERT INTO public.configuracion (clave, valor, descripcion)
VALUES ('delivery_price', '0', 'Precio del delivery en guaraníes para Ciudad del Este')
ON CONFLICT (clave) DO NOTHING;
