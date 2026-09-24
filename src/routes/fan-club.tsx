import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { BookOpen, CalendarDays, CheckCircle2, LogIn, MessageCircle, Plus, ShieldCheck, UserPlus, Users } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Profile = {
  id: string;
  display_name: string;
  handle: string;
  avatar_path: string | null;
  fan_since_year: number | null;
  bio: string | null;
};

type Thread = {
  id: string;
  title: string;
  body: string;
  category: string;
  created_at: string;
  author_id: string | null;
  is_official: boolean;
};

type Comment = {
  id: string;
  body: string;
  created_at: string;
  author_id: string | null;
};

const categories = ["Books", "Film & Ideas", "Interviews", "Creative Legacy", "Community"];

export const Route = createFileRoute("/fan-club")({
  head: () => ({
    meta: [
      { title: "Mother of the Matrix Fan Club | Sophia Stewart" },
      { name: "description", content: "Join respectful, moderated conversations about Sophia Stewart's books, interviews, and creative legacy." },
      { property: "og:title", content: "Mother of the Matrix Fan Club" },
      { property: "og:description", content: "A moderated community for readers and supporters of Sophia Stewart." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FanClubPage,
});

function FanClubPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [openThread, setOpenThread] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const currentYear = new Date().getFullYear();
  const memberIds = useMemo(() => Object.keys(profiles), [profiles]);

  async function loadCommunity() {
    const [{ data: threadRows }, { data: profileRows }] = await Promise.all([
      supabase.from("threads").select("id,title,body,category,created_at,author_id,is_official").order("created_at", { ascending: false }),
      supabase.from("profiles").select("id,display_name,handle,avatar_path,fan_since_year,bio"),
    ]);
    setThreads((threadRows ?? []) as Thread[]);
    setProfiles(Object.fromEntries(((profileRows ?? []) as Profile[]).map((item) => [item.id, item])));
  }

  async function loadCurrentProfile(activeUser: User | null) {
    if (!activeUser) {
      setProfile(null);
      return;
    }
    const { data } = await supabase.from("profiles").select("id,display_name,handle,avatar_path,fan_since_year,bio").eq("id", activeUser.id).maybeSingle();
    setProfile((data as Profile | null) ?? null);
    if (!data) setProfileOpen(true);
  }

  useEffect(() => {
    void loadCommunity();
    void supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      void loadCurrentProfile(data.user);
    });
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      setUser(session?.user ?? null);
      void loadCurrentProfile(session?.user ?? null);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  async function loadComments(threadId: string) {
    if (openThread === threadId) {
      setOpenThread(null);
      return;
    }
    const { data } = await supabase.from("comments").select("id,body,created_at,author_id").eq("thread_id", threadId).order("created_at");
    setComments((current) => ({ ...current, [threadId]: (data ?? []) as Comment[] }));
    setOpenThread(threadId);
  }

  async function submitAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const mode = String(form.get("mode") ?? "signin");
    const result = mode === "signup"
      ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/fan-club` } })
      : await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (result.error) return setMessage(result.error.message);
    if (mode === "signup" && !result.data.session) setMessage("Check your email to confirm your account, then return here to sign in.");
    else setAuthOpen(false);
  }

  async function googleSignIn() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/fan-club` });
    setBusy(false);
    if (result.error) setMessage(result.error.message);
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    setBusy(true);
    const form = new FormData(event.currentTarget);
    let avatarPath = profile?.avatar_path ?? null;
    const avatar = form.get("avatar");
    if (avatar instanceof File && avatar.size > 0) {
      const extension = avatar.name.split(".").pop()?.toLowerCase() ?? "jpg";
      avatarPath = `${user.id}/avatar-${Date.now()}.${extension}`;
      const upload = await supabase.storage.from("fan-avatars").upload(avatarPath, avatar, { upsert: true });
      if (upload.error) {
        setBusy(false);
        return setMessage(upload.error.message);
      }
    }
    const nextProfile = {
      id: user.id,
      display_name: String(form.get("displayName") ?? "").trim(),
      handle: String(form.get("handle") ?? "").trim().toLowerCase().replace(/[^a-z0-9_]/g, "_"),
      fan_since_year: Number(form.get("fanSince")),
      bio: String(form.get("bio") ?? "").trim() || null,
      avatar_path: avatarPath,
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase.from("profiles").upsert(nextProfile).select("id,display_name,handle,avatar_path,fan_since_year,bio").single();
    setBusy(false);
    if (error) return setMessage(error.message);
    setProfile(data as Profile);
    setProfileOpen(false);
    setMessage("Profile saved.");
    void loadCommunity();
  }

  async function submitThread(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !profile) return setProfileOpen(true);
    setBusy(true);
    const form = new FormData(event.currentTarget);
    const { error } = await supabase.from("threads").insert({
      author_id: user.id,
      title: String(form.get("title") ?? "").trim(),
      body: String(form.get("body") ?? "").trim(),
      category: String(form.get("category") ?? "Community"),
    });
    setBusy(false);
    if (error) return setMessage(error.message);
    setComposeOpen(false);
    setMessage("Your thread was sent to the back office for approval.");
  }

  async function submitComment(event: FormEvent<HTMLFormElement>, threadId: string) {
    event.preventDefault();
    if (!user || !profile) return setAuthOpen(true);
    setBusy(true);
    const form = new FormData(event.currentTarget);
    const { error } = await supabase.from("comments").insert({ thread_id: threadId, author_id: user.id, body: String(form.get("body") ?? "").trim() });
    setBusy(false);
    if (error) return setMessage(error.message);
    event.currentTarget.reset();
    setMessage("Your comment was sent for approval.");
  }

  return (
    <main className="club-shell">
      <header className="club-header">
        <Link to="/" className="club-brand"><span>Sophia Stewart</span><small>Mother of the Matrix Fan Club</small></Link>
        <div className="club-header-actions">
          {user ? <Button variant="outline" size="sm" onClick={() => setProfileOpen(true)}>My profile</Button> : <Button size="sm" onClick={() => setAuthOpen(true)}><LogIn /> Join / Sign in</Button>}
        </div>
      </header>

      <section className="club-intro">
        <div>
          <p className="section-kicker">Official fan community</p>
          <h1>Mother of the Matrix<br /><em>Fan Club</em></h1>
          <p>A respectful place to explore Sophia Stewart&apos;s books, interviews, ideas, and creative legacy together.</p>
          <div className="club-actions">
            <Button onClick={() => user ? setComposeOpen(true) : setAuthOpen(true)}><Plus /> Start a conversation</Button>
            {!user && <Button variant="outline" onClick={() => setAuthOpen(true)}><UserPlus /> Create fan account</Button>}
          </div>
        </div>
        <aside className="club-principles">
          <ShieldCheck aria-hidden="true" />
          <strong>Positive. Thoughtful. Moderated.</strong>
          <p>New conversations and comments are reviewed before appearing publicly.</p>
        </aside>
      </section>

      {message && <div className="club-notice" role="status"><CheckCircle2 />{message}</div>}

      <section className="club-layout">
        <div className="club-feed">
          <div className="club-section-heading">
            <div><p className="section-kicker">Community conversations</p><h2>Talk, listen, connect.</h2></div>
            <span>{threads.length} active topics</span>
          </div>
          {threads.map((thread) => {
            const author = thread.author_id ? profiles[thread.author_id] : null;
            const threadComments = comments[thread.id] ?? [];
            return (
              <article className="thread-card" key={thread.id}>
                <div className="thread-meta">
                  <span className="thread-category">{thread.category}</span>
                  {thread.is_official && <span className="official-badge"><CheckCircle2 /> Official topic</span>}
                </div>
                <h3>{thread.title}</h3>
                <p>{thread.body}</p>
                <div className="thread-footer">
                  <div className="thread-author"><span className="member-avatar">{author?.display_name?.slice(0, 1) ?? "S"}</span><span>{author?.display_name ?? "Sophia Stewart Fan Club"}<small>{author?.fan_since_year ? `Fan since ${author.fan_since_year}` : "Community host"}</small></span></div>
                  <Button variant="ghost" size="sm" onClick={() => void loadComments(thread.id)}><MessageCircle /> Join conversation</Button>
                </div>
                {openThread === thread.id && (
                  <div className="comment-panel">
                    {threadComments.length === 0 ? <p className="empty-comments">Be the first to add a thoughtful comment.</p> : threadComments.map((comment) => <div className="comment" key={comment.id}><strong>{comment.author_id ? profiles[comment.author_id]?.display_name ?? "Fan member" : "Fan member"}</strong><p>{comment.body}</p></div>)}
                    {user ? <form onSubmit={(event) => void submitComment(event, thread.id)}><Textarea name="body" minLength={2} maxLength={1500} placeholder="Add to the conversation…" required /><Button disabled={busy} size="sm">Submit for approval</Button></form> : <Button size="sm" onClick={() => setAuthOpen(true)}>Sign in to comment</Button>}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <aside className="club-sidebar">
          <section><Users /><h2>Member spotlights</h2><p>{memberIds.length ? `${memberIds.length} fans are building this community.` : "Be among the first fans to create a profile."}</p></section>
          <section><BookOpen /><h2>Conversation guide</h2><ul><li>Celebrate the books and creative journey.</li><li>Share interpretations, not personal attacks.</li><li>Keep claims respectful and relevant.</li><li>Protect everyone&apos;s privacy.</li></ul></section>
          <section><CalendarDays /><h2>Your fan story</h2><p>Add the year you became a fan so fellow readers can celebrate your journey.</p></section>
        </aside>
      </section>

      {(authOpen || composeOpen || profileOpen) && <div className="club-modal-backdrop" onClick={() => { setAuthOpen(false); setComposeOpen(false); if (profile) setProfileOpen(false); }}>
        <div className="club-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
          <button className="club-modal-close" aria-label="Close" onClick={() => { setAuthOpen(false); setComposeOpen(false); if (profile) setProfileOpen(false); }}>×</button>
          {authOpen && <AuthPanel busy={busy} message={message} onSubmit={submitAuth} onGoogle={googleSignIn} />}
          {composeOpen && <ThreadPanel busy={busy} onSubmit={submitThread} />}
          {profileOpen && <ProfilePanel profile={profile} currentYear={currentYear} busy={busy} onSubmit={saveProfile} />}
        </div>
      </div>}
    </main>
  );
}

function AuthPanel({ busy, message, onSubmit, onGoogle }: { busy: boolean; message: string; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onGoogle: () => void }) {
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  return <div className="club-form-panel"><p className="section-kicker">Fan membership</p><h2>{mode === "signup" ? "Join the conversation." : "Welcome back."}</h2><p>Your account lets you create discussions, comment, follow fans, and share your fan story.</p><Button variant="outline" onClick={onGoogle} disabled={busy}>Continue with Google</Button><div className="form-divider"><span>or use email</span></div><form onSubmit={onSubmit}><input type="hidden" name="mode" value={mode} /><label>Email<Input name="email" type="email" autoComplete="email" required /></label><label>Password<Input name="password" type="password" minLength={8} autoComplete={mode === "signup" ? "new-password" : "current-password"} required /></label>{message && <p className="form-message">{message}</p>}<Button disabled={busy}>{busy ? "Please wait…" : mode === "signup" ? "Create fan account" : "Sign in"}</Button></form><button className="form-switch" onClick={() => setMode(mode === "signup" ? "signin" : "signup")}>{mode === "signup" ? "Already a member? Sign in" : "New here? Create an account"}</button></div>;
}

function ThreadPanel({ busy, onSubmit }: { busy: boolean; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <div className="club-form-panel"><p className="section-kicker">New conversation</p><h2>Start a thoughtful thread.</h2><p>It will appear after the back office reviews and approves it.</p><form onSubmit={onSubmit}><label>Topic<Input name="title" minLength={5} maxLength={120} required /></label><label>Category<select name="category">{categories.map((category) => <option key={category}>{category}</option>)}</select></label><label>Your message<Textarea name="body" minLength={20} maxLength={3000} required /></label><Button disabled={busy}>{busy ? "Sending…" : "Submit for approval"}</Button></form></div>;
}

function ProfilePanel({ profile, currentYear, busy, onSubmit }: { profile: Profile | null; currentYear: number; busy: boolean; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <div className="club-form-panel"><p className="section-kicker">Fan profile</p><h2>Tell the club about you.</h2><p>Your name, photo, and fan history appear beside approved conversations.</p><form onSubmit={onSubmit}><label>Name<Input name="displayName" defaultValue={profile?.display_name ?? ""} minLength={2} maxLength={60} required /></label><label>Username<Input name="handle" defaultValue={profile?.handle ?? ""} minLength={3} maxLength={30} placeholder="your_name" required /></label><label>Fan since<Input name="fanSince" type="number" min={1960} max={currentYear} defaultValue={profile?.fan_since_year ?? currentYear} required /></label><label>Profile photo<Input name="avatar" type="file" accept="image/jpeg,image/png,image/webp" /></label><label>Short bio<Textarea name="bio" maxLength={280} defaultValue={profile?.bio ?? ""} /></label><Button disabled={busy}>{busy ? "Saving…" : "Save profile"}</Button></form></div>;
}