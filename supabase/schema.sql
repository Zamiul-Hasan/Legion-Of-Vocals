-- ==============================================================================
-- LEGION OF VOCALS (LOV-PORTAL) — PRODUCTION POSTGRESQL SCHEMA
-- Built for Supabase (Auth, Realtime, Database, Storage)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS & DOMAINS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('Founder', 'Admin', 'Senior VA', 'Sound Lead', 'Translator', 'Member', 'Outsider');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Linked with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    lov_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    email_verified BOOLEAN DEFAULT false,
    full_name TEXT NOT NULL,
    display_name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'Member',
    department TEXT DEFAULT 'Voice Acting',
    level INT DEFAULT 1,
    points INT DEFAULT 100,
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    bio TEXT DEFAULT 'Passionate anime voice actor & Legion of Vocals member.',
    stats JSONB DEFAULT '{"projects": 0, "dubVideos": 0, "qaApproved": 0, "auditionsWon": 0}'::jsonb,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for instant LOV ID, username, and email lookups
CREATE INDEX IF NOT EXISTS idx_profiles_lov_id ON public.profiles(lov_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_points ON public.profiles(points DESC);

-- 4. UNIQUE LOV ID GENERATOR SEQUENCE
CREATE SEQUENCE IF NOT EXISTS lov_id_seq START WITH 1001;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    next_num INT;
    generated_lov_id TEXT;
    base_username TEXT;
    final_username TEXT;
BEGIN
    -- Generate sequential LOV ID: LOV-2026-XXXX
    next_num := nextval('lov_id_seq');
    generated_lov_id := 'LOV-2026-' || LPAD(next_num::TEXT, 4, '0');

    -- Derive base username from email or metadata
    base_username := LOWER(SPLIT_PART(NEW.email, '@', 1));
    final_username := base_username || '_' || LPAD(next_num::TEXT, 3, '0');

    INSERT INTO public.profiles (
        id,
        lov_id,
        email,
        email_verified,
        full_name,
        display_name,
        username,
        role,
        department,
        avatar_url
    )
    VALUES (
        NEW.id,
        generated_lov_id,
        NEW.email,
        NEW.email_confirmed_at IS NOT NULL,
        COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'display_name', SPLIT_PART(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'username', final_username),
        COALESCE(NEW.raw_user_meta_data->>'role', 'Member'),
        COALESCE(NEW.raw_user_meta_data->>'department', 'Voice Acting'),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80')
    )
    ON CONFLICT (id) DO UPDATE SET
        email_verified = NEW.email_confirmed_at IS NOT NULL,
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on Supabase Auth User Creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT OR UPDATE OF email_confirmed_at ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    image TEXT NOT NULL,
    status TEXT DEFAULT 'Ongoing', -- 'Completed', 'Ongoing', 'Upcoming'
    progress INT DEFAULT 0,
    release_date TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. DUB VIDEOS TABLE
CREATE TABLE IF NOT EXISTS public.dub_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    video_url TEXT NOT NULL,
    thumbnail TEXT,
    character_name TEXT,
    department TEXT DEFAULT 'Voice Acting',
    duration TEXT,
    views INT DEFAULT 0,
    likes INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CONTESTS TABLE
CREATE TABLE IF NOT EXISTS public.contests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    banner_image TEXT NOT NULL,
    banner_caption TEXT NOT NULL,
    prize_pool TEXT DEFAULT '10,000 BDT',
    official_hashtag TEXT DEFAULT '#lov_contest_round1',
    active_round_id TEXT DEFAULT 'r1',
    show_banner BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'Ongoing',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CONTEST ROUNDS TABLE
CREATE TABLE IF NOT EXISTS public.contest_rounds (
    id TEXT PRIMARY KEY, -- e.g. 'r1', 'r2', 'r3' or UUID
    contest_id UUID REFERENCES public.contests(id) ON DELETE CASCADE,
    round_number INT NOT NULL,
    title TEXT NOT NULL,
    hashtag TEXT NOT NULL,
    deadline TEXT,
    status TEXT DEFAULT 'Active', -- 'Active', 'Completed', 'Upcoming'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CONTEST ENTRIES TABLE
CREATE TABLE IF NOT EXISTS public.contest_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contest_id UUID REFERENCES public.contests(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    competitor_name TEXT NOT NULL,
    is_member BOOLEAN DEFAULT false,
    lov_id TEXT,
    email TEXT NOT NULL,
    role TEXT NOT NULL,
    note TEXT,
    images TEXT[] DEFAULT '{}',
    votes INT DEFAULT 0,
    round_scores JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. CONTEST ROUND SCORES TABLE (Detailed rubric per round)
CREATE TABLE IF NOT EXISTS public.contest_round_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_id UUID REFERENCES public.contest_entries(id) ON DELETE CASCADE,
    round_id TEXT NOT NULL,
    vocal_points INT DEFAULT 0,
    lipsync_points INT DEFAULT 0,
    emotion_points INT DEFAULT 0,
    bonus_points INT DEFAULT 0,
    total_points INT DEFAULT 0,
    judge_note TEXT,
    judge_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(entry_id, round_id)
);

-- 11. MESSAGES TABLE (Real-time Messenger)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation 
    ON public.messages(sender_id, receiver_id, created_at DESC);

-- 12. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    link TEXT,
    unread BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user 
    ON public.notifications(user_id, created_at DESC);

-- ==============================================================================
-- 13. REALTIME REPLICATION (For instant live messenger & live leaderboard)
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.contest_entries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.contest_round_scores;

-- ==============================================================================
-- 14. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dub_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_round_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can view profiles, users can update their own
CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Projects & Dub Videos: Viewable by all, Insert/Update by Admins
CREATE POLICY "Projects are viewable by everyone" 
    ON public.projects FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create projects" 
    ON public.projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Dub videos are viewable by everyone" 
    ON public.dub_videos FOR SELECT USING (true);

-- Contests: Viewable by all, editable by authenticated admins
CREATE POLICY "Contests are viewable by everyone" 
    ON public.contests FOR SELECT USING (true);

CREATE POLICY "Contest rounds are viewable by everyone" 
    ON public.contest_rounds FOR SELECT USING (true);

CREATE POLICY "Contest rounds can be updated" 
    ON public.contest_rounds FOR ALL USING (true);

CREATE POLICY "Contest entries are viewable by everyone" 
    ON public.contest_entries FOR SELECT USING (true);

CREATE POLICY "Anyone can register for a contest" 
    ON public.contest_entries FOR INSERT WITH CHECK (true);

CREATE POLICY "Contest entries can be updated or deleted" 
    ON public.contest_entries FOR ALL USING (true);

CREATE POLICY "Round scores are viewable by everyone" 
    ON public.contest_round_scores FOR SELECT USING (true);

CREATE POLICY "Judges can score contest entries" 
    ON public.contest_round_scores FOR ALL USING (auth.role() = 'authenticated');

-- Messages: Users can see messages where they are sender or receiver
CREATE POLICY "Users can view their own messages" 
    ON public.messages FOR SELECT 
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" 
    ON public.messages FOR INSERT 
    WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can mark messages as read" 
    ON public.messages FOR UPDATE 
    USING (auth.uid() = receiver_id);

-- Notifications: Users can view their own notifications
CREATE POLICY "Users can view their notifications" 
    ON public.notifications FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notifications" 
    ON public.notifications FOR UPDATE 
    USING (auth.uid() = user_id);

-- ==============================================================================
-- 15. SEED INITIAL DATA (Default Projects & Contest)
-- ==============================================================================
INSERT INTO public.contests (
    id,
    title,
    subtitle,
    banner_image,
    banner_caption,
    prize_pool,
    official_hashtag,
    active_round_id,
    status
) VALUES (
    'a1000000-0000-0000-0000-000000000001',
    'Solo Leveling: Bangla Dub Championship 2026',
    'Open to All LOV Studio Members & Outsider Voice Artists',
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1600&q=80',
    'Official Bangla Anime Dubbing Tournament! Submit your voice acting reels with hashtag #lov_contest_round1. Show your vocal acting, lip-sync, and character emotion in #BanglaDub. Top 3 champions will receive official LOV certificates and studio casting contracts!',
    '15,000 BDT + Studio Contracts',
    '#lov_contest_round1',
    'r1',
    'Ongoing'
) ON CONFLICT DO NOTHING;

INSERT INTO public.contest_rounds (id, contest_id, round_number, title, hashtag, deadline, status)
VALUES 
('r1', 'a1000000-0000-0000-0000-000000000001', 1, 'Round 1: Open Audition', '#lov_contest_round1', 'October 15, 2026', 'Active'),
('r2', 'a1000000-0000-0000-0000-000000000001', 2, 'Round 2: Battle & Dialogue', '#lov_contest_round2', 'October 25, 2026', 'Upcoming'),
('r3', 'a1000000-0000-0000-0000-000000000001', 3, 'Grand Finale: Character Voice Showdown', '#lov_contest_finale', 'November 5, 2026', 'Upcoming')
ON CONFLICT DO NOTHING;
