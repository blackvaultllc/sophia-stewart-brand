import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, ShieldAlert, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

type QueueItem = { id: string; title?: string; body: string; category?: string; created_at: string; kind: "thread" | "comment" };

export const Route = createFileRoute("/_authenticated/moderation")({
  head: () => ({ meta: [
    { title: "Fan Club Moderation | Sophia Stewart" },
    { name: "description", content: "Private moderation area for the Mother of the Matrix Fan Club." },
    { property: "og:title", content: "Fan Club Moderation" },
    { property: "og:description", content: "Private community review tools." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: ModerationPage,
});

function ModerationPage() {
  const { user } = Route.useRouteContext();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [items, setItems] = useState<QueueItem[]>([]);

  async function loadQueue() {
    const { data: isStaff } = await supabase.rpc("is_staff", { _user_id: user.id });
    setAllowed(Boolean(isStaff));
    if (!isStaff) return;
    const [{ data: threads }, { data: comments }] = await Promise.all([
      supabase.from("threads").select("id,title,body,category,created_at").eq("status", "pending").order("created_at"),
      supabase.from("comments").select("id,body,created_at").eq("status", "pending").order("created_at"),
    ]);
    setItems([
      ...(threads ?? []).map((item) => ({ ...item, kind: "thread" as const })),
      ...(comments ?? []).map((item) => ({ ...item, kind: "comment" as const })),
    ].sort((a, b) => a.created_at.localeCompare(b.created_at)));
  }

  useEffect(() => { void loadQueue(); }, []);

  async function review(item: QueueItem, status: "approved" | "rejected") {
    const values = { status, reviewed_at: new Date().toISOString(), reviewed_by: user.id };
    if (item.kind === "thread") await supabase.from("threads").update(values).eq("id", item.id);
    else await supabase.from("comments").update(values).eq("id", item.id);
    setItems((current) => current.filter((entry) => entry.id !== item.id));
  }

  if (allowed === null) return <main className="moderation-shell"><p>Checking staff access…</p></main>;
  if (!allowed) return <main className="moderation-shell moderation-denied"><ShieldAlert /><h1>Staff access only</h1><p>This review area is limited to approved back-office team members.</p><Button asChild><Link to="/fan-club">Return to fan club</Link></Button></main>;
  return <main className="moderation-shell"><header><div><p className="section-kicker">Back office</p><h1>Community moderation</h1></div><Button variant="outline" asChild><Link to="/fan-club">View fan club</Link></Button></header><p className="moderation-count">{items.length} submissions waiting for review</p><div className="moderation-list">{items.map((item) => <article key={`${item.kind}-${item.id}`}><div><span>{item.kind} {item.category ? `· ${item.category}` : ""}</span><h2>{item.title ?? "Comment submission"}</h2><p>{item.body}</p></div><div className="moderation-actions"><Button onClick={() => void review(item, "approved")}><Check /> Approve</Button><Button variant="outline" onClick={() => void review(item, "rejected")}><X /> Reject</Button></div></article>)}</div></main>;
}