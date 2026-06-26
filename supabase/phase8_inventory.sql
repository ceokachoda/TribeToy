-- Raw Materials (Inventory)
CREATE TABLE public.raw_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,          -- e.g. "PLA Matte"
    color TEXT NOT NULL,         -- e.g. "Black"
    current_stock_grams INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Daily usage logs
CREATE TABLE public.raw_material_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    raw_material_id UUID NOT NULL REFERENCES public.raw_materials(id) ON DELETE CASCADE,
    grams_used INTEGER NOT NULL,
    date_used DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies
ALTER TABLE public.raw_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raw_material_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage raw_materials" ON public.raw_materials
    FOR ALL
    TO authenticated
    USING ( (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' );

CREATE POLICY "Admins can manage raw_material_logs" ON public.raw_material_logs
    FOR ALL
    TO authenticated
    USING ( (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' );
