-- Add address column to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;

-- customizations table
CREATE TABLE IF NOT EXISTS customizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  description TEXT NOT NULL,
  reference_image_url TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE customizations ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Anyone can insert customizations" ON customizations;
CREATE POLICY "Anyone can insert customizations" ON customizations FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can read their own customizations" ON customizations;
CREATE POLICY "Users can read their own customizations" ON customizations FOR SELECT USING (
  auth.uid() = user_id OR user_id IS NULL
);

DROP POLICY IF EXISTS "Admins can view all customizations" ON customizations;
CREATE POLICY "Admins can view all customizations" ON customizations FOR SELECT USING (
  is_admin()
);

DROP POLICY IF EXISTS "Admins can update customizations" ON customizations;
CREATE POLICY "Admins can update customizations" ON customizations FOR UPDATE USING (
  is_admin()
);
