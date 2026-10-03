import { supabase, isSupabaseConfigured } from "../lib/supabase";

export const contestService = {
  // Fetch active contest with rounds and entries
  async getActiveContest() {
    if (!isSupabaseConfigured()) return null;

    const { data: contest, error } = await supabase
      .from("contests")
      .select(`
        *,
        rounds:contest_rounds(*),
        entries:contest_entries(*)
      `)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !contest) return null;
    return contest;
  },

  // Register contestant entry (Member or Outsider)
  async registerEntry({ contestId, competitorName, isMember, lovId, email, role, note, images }) {
    if (!isSupabaseConfigured()) return null;

    const { data, error } = await supabase
      .from("contest_entries")
      .insert({
        contest_id: contestId,
        competitor_name: competitorName,
        is_member: isMember,
        lov_id: lovId,
        email,
        role,
        note,
        images: images || [],
        round_scores: {},
        votes: 0,
      })
      .select()
      .single();

    return { data, error };
  },

  // Award or update round points
  async saveRoundScore({ entryId, roundId, vocalPoints, lipsyncPoints, emotionPoints, bonusPoints, judgeNote, judgeId }) {
    if (!isSupabaseConfigured()) return null;

    const totalPoints = Number(vocalPoints || 0) + Number(lipsyncPoints || 0) + Number(emotionPoints || 0) + Number(bonusPoints || 0);

    const { data, error } = await supabase
      .from("contest_round_scores")
      .upsert({
        entry_id: entryId,
        round_id: roundId,
        vocal_points: vocalPoints,
        lipsync_points: lipsyncPoints,
        emotion_points: emotionPoints,
        bonus_points: bonusPoints,
        total_points: totalPoints,
        judge_note: judgeNote,
        judge_id: judgeId,
        updated_at: new Date().toISOString(),
      }, { onConflict: "entry_id,round_id" })
      .select()
      .single();

    return { data, error };
  },

  // Real-time subscription to contest updates
  subscribeToContest(contestId, onUpdate) {
    if (!isSupabaseConfigured()) return () => {};

    const channel = supabase
      .channel(`contest-${contestId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "contest_entries" }, onUpdate)
      .on("postgres_changes", { event: "*", schema: "public", table: "contest_round_scores" }, onUpdate)
      .subscribe();

    return () => supabase.removeChannel(channel);
  },
};
