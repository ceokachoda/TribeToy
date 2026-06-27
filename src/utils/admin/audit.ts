import { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/utils/supabase/admin";

export async function getActorId(supabase: SupabaseClient): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function verifyAdminActor(supabase: SupabaseClient): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return null;
  return user.id;
}

type AuditEvent = {
  actorId: string | null;
  action: string;
  entity: string;
  entityId?: string;
  before?: Record<string, any>;
  after?: Record<string, any>;
};

export async function logAudit(supabase: SupabaseClient, event: AuditEvent) {
  // Use the admin client to bypass RLS since the audit_logs table blocks direct inserts from anon/authenticated
  const adminClient = createAdminClient();
  
  const { error } = await adminClient.from("audit_logs").insert({
    actor_id: event.actorId,
    action: event.action,
    entity: event.entity,
    entity_id: event.entityId,
    previous_data: event.before || null,
    new_data: event.after || null,
  });

  if (error) {
    console.error("Failed to log audit event:", error);
  }
}
