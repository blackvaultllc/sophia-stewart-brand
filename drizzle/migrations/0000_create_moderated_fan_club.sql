CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE public.moderation_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  display_name text NOT NULL CHECK (char_length(display_name) BETWEEN 2 AND 60),
  handle text NOT NULL UNIQUE CHECK (handle ~ '^[a-z0-9_]{3,30}$'),
  avatar_path text,
  fan_since_year integer CHECK (fan_since_year BETWEEN 1960 AND EXTRACT(YEAR FROM CURRENT_DATE)::integer),
  bio text CHECK (char_length(bio) <= 280),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin') OR public.has_role(_user_id, 'moderator')
$$;
GRANT EXECUTE ON FUNCTION public.is_staff(uuid) TO anon, authenticated, service_role;

CREATE POLICY "Profiles are publicly readable" ON public.profiles FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Fans create their profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Fans update their profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Fans delete their profile" ON public.profiles FOR DELETE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Members read their roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "Staff manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  title text NOT NULL CHECK (char_length(title) BETWEEN 5 AND 120),
  body text NOT NULL CHECK (char_length(body) BETWEEN 20 AND 3000),
  category text NOT NULL CHECK (category IN ('Books', 'Film & Ideas', 'Interviews', 'Creative Legacy', 'Community')),
  status public.moderation_status NOT NULL DEFAULT 'pending',
  is_official boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid
);
GRANT SELECT ON public.threads TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.threads TO authenticated;
GRANT ALL ON public.threads TO service_role;
ALTER TABLE public.threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved threads are public" ON public.threads FOR SELECT TO anon, authenticated USING (status = 'approved');
CREATE POLICY "Authors read pending threads" ON public.threads FOR SELECT TO authenticated USING (author_id = auth.uid());
CREATE POLICY "Staff read all threads" ON public.threads FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Fans submit threads" ON public.threads FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid() AND status = 'pending' AND is_official = false);
CREATE POLICY "Staff moderate threads" ON public.threads FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Authors delete pending threads" ON public.threads FOR DELETE TO authenticated USING (author_id = auth.uid() AND status = 'pending');

CREATE TABLE public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES public.threads(id) ON DELETE CASCADE,
  author_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  body text NOT NULL CHECK (char_length(body) BETWEEN 2 AND 1500),
  status public.moderation_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid
);
GRANT SELECT ON public.comments TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.comments TO authenticated;
GRANT ALL ON public.comments TO service_role;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved comments are public" ON public.comments FOR SELECT TO anon, authenticated USING (status = 'approved');
CREATE POLICY "Authors read pending comments" ON public.comments FOR SELECT TO authenticated USING (author_id = auth.uid());
CREATE POLICY "Staff read all comments" ON public.comments FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Fans submit comments" ON public.comments FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid() AND status = 'pending');
CREATE POLICY "Staff moderate comments" ON public.comments FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Authors delete pending comments" ON public.comments FOR DELETE TO authenticated USING (author_id = auth.uid() AND status = 'pending');

CREATE TABLE public.follows (
  follower_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id <> following_id)
);
GRANT SELECT ON public.follows TO anon, authenticated;
GRANT INSERT, DELETE ON public.follows TO authenticated;
GRANT ALL ON public.follows TO service_role;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Follows are publicly readable" ON public.follows FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Fans follow members" ON public.follows FOR INSERT TO authenticated WITH CHECK (follower_id = auth.uid());
CREATE POLICY "Fans unfollow members" ON public.follows FOR DELETE TO authenticated USING (follower_id = auth.uid());

CREATE INDEX threads_status_created_idx ON public.threads(status, created_at DESC);
CREATE INDEX comments_thread_status_idx ON public.comments(thread_id, status, created_at);
CREATE INDEX follows_following_idx ON public.follows(following_id);

INSERT INTO public.threads (title, body, category, status, is_official, created_at) VALUES
('Welcome to the Mother of the Matrix Fan Club', 'Introduce yourself, share how long you have followed Sophia Stewart’s work, and tell the community which part of her creative journey first captured your attention.', 'Community', 'approved', true, now() - interval '4 days'),
('Reading The Third Eye: themes that stayed with you', 'What ideas, characters, or themes from The Third Eye stayed with you after reading? Keep the conversation thoughtful and grounded in the published work.', 'Books', 'approved', true, now() - interval '3 days'),
('From page to screen: creative ideas worth discussing', 'Discuss storytelling ideas and themes you noticed across Sophia’s books and science-fiction cinema. Focus on interpretation, curiosity, and respectful exchange.', 'Film & Ideas', 'approved', true, now() - interval '2 days'),
('Your favorite Sophia Stewart interview moment', 'Share an interview moment that helped you understand Sophia’s perspective, writing process, resilience, or creative legacy in a new way.', 'Interviews', 'approved', true, now() - interval '1 day');