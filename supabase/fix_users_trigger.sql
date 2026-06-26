-- 1. Create a function that automatically inserts a new user into our public.users table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'customer');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create a trigger that calls this function every time a user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Backfill: Insert any existing users (like the one you just used) into public.users so they aren't missing!
INSERT INTO public.users (id, email, full_name, role)
SELECT id, email, raw_user_meta_data->>'full_name', 'customer'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users);
