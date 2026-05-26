import { supabase } from "@/lib/supabase";

export async function isInvitedEmail(email: string | null | undefined) {
  if (!email) return false;

  const { data } = await supabase
    .from("invite_emails")
    .select("email")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  return Boolean(data?.email);
}
