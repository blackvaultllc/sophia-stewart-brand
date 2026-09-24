CREATE OR REPLACE FUNCTION public.assign_back_office_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF lower(coalesce(auth.jwt() ->> 'email', '')) = 'sophiastewart10@yahoo.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER assign_back_office_role_after_profile
AFTER INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.assign_back_office_role();