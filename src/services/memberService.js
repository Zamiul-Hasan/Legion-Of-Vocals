import { supabase, isSupabaseConfigured } from "../lib/supabase";
import defaultMembers from "../data/members";

export const memberService = {
  // Fetch all members with points ranking
  async getMembers() {
    if (!isSupabaseConfigured()) {
      return defaultMembers;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("points", { ascending: false });

    if (error || !data || data.length === 0) {
      return defaultMembers;
    }

    return data.map((p) => ({
      id: p.id,
      lovId: p.lov_id,
      email: p.email,
      fullName: p.full_name,
      displayName: p.display_name,
      username: p.username,
      role: p.role,
      department: p.department,
      level: p.level,
      avatar: p.avatar_url,
      bio: p.bio,
      stats: p.stats || { projects: 0, dubVideos: 0, points: p.points },
    }));
  },

  // Lookup member by unique LOV ID
  async getMemberByLovId(lovId) {
    if (!isSupabaseConfigured()) {
      return defaultMembers.find((m) => m.lovId?.toUpperCase() === lovId?.toUpperCase());
    }

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .ilike("lov_id", lovId)
      .single();

    return data;
  },

  // Update profile avatar picture
  async updateAvatar(userId, avatarUrl) {
    if (!isSupabaseConfigured()) {
      return { success: true };
    }

    const { error } = await supabase
      .from("profiles")
      .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
      .eq("id", userId);

    return { success: !error, error };
  },
};
