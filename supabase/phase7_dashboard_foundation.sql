-- Phase 7: Dashboard Foundation
-- This migration adds the foundational tables and columns required for the admin dashboard,
-- while respecting the existing schema and data.

-- 1. Extend products for advanced inventory tracking
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS reserved INT DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS damaged INT DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS low_stock_threshold INT DEFAULT 5;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS location TEXT;

-- 2. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id UUID,
  before JSONB,
  after JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for Audit Logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view audit logs" ON public.audit_logs FOR SELECT USING (is_admin());

-- No direct inserts via API - only through backend functions or triggers
DROP POLICY IF EXISTS "No direct inserts for audit logs" ON public.audit_logs;
CREATE POLICY "No direct inserts for audit logs" ON public.audit_logs FOR INSERT WITH CHECK (false);

-- 3. Settings Table
CREATE TYPE courier_type AS ENUM ('speedpost', 'delhivery', 'other');

CREATE TABLE IF NOT EXISTS public.settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  sender_name TEXT NOT NULL DEFAULT 'TribeToy Pvt Ltd',
  sender_address TEXT NOT NULL DEFAULT 'TIC, IIT Guwahati',
  sender_city TEXT NOT NULL DEFAULT 'Guwahati',
  sender_state TEXT NOT NULL DEFAULT 'Assam',
  sender_pincode TEXT NOT NULL DEFAULT '781039',
  sender_phone TEXT NOT NULL DEFAULT '8003790347',
  default_courier courier_type NOT NULL DEFAULT 'speedpost',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT settings_singleton CHECK (id = 1)
);

INSERT INTO public.settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage settings" ON public.settings;
CREATE POLICY "Admins can manage settings" ON public.settings FOR ALL USING (is_admin());

-- 4. Shipments Table
CREATE TABLE IF NOT EXISTS public.shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  courier courier_type NOT NULL DEFAULT 'speedpost',
  awb TEXT,
  label_template TEXT NOT NULL DEFAULT 'speedpost_a4',
  label_pdf_url TEXT,
  dispatch_date DATE,
  tracking_status TEXT,
  pickup_info JSONB,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view shipments" ON public.shipments;
CREATE POLICY "Admins can view shipments" ON public.shipments FOR SELECT USING (is_admin());
DROP POLICY IF EXISTS "Admins can insert shipments" ON public.shipments;
CREATE POLICY "Admins can insert shipments" ON public.shipments FOR INSERT WITH CHECK (is_admin());
DROP POLICY IF EXISTS "Admins can update shipments" ON public.shipments;
CREATE POLICY "Admins can update shipments" ON public.shipments FOR UPDATE USING (is_admin());
