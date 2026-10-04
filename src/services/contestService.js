import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { db, isFirebaseConfigured } from "../lib/firebase";
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";

export const contestService = {
  // Fetch active contest with rounds and entries
  async getActiveContest() {
    try {
      let contest = null;

      // 1. Fetch from Supabase if configured
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from("contests")
          .select(`
            *,
            rounds:contest_rounds(*),
            entries:contest_entries(*)
          `)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (!error && data) {
          contest = data;
        }
      }

      // 2. Extract any live round status sync signals from contest_entries and Firebase
      const realEntries = [];
      const roundStatusMap = {};

      if (contest) {
        // Sort entries by created_at ascending so latest sync signals override earlier ones
        const sortedEntries = (contest.entries || []).slice().sort((a, b) => {
          const timeA = new Date(a.created_at || 0).getTime();
          const timeB = new Date(b.created_at || 0).getTime();
          return timeA - timeB;
        });

        sortedEntries.forEach((e) => {
          if (
            e.role === "SYSTEM_SYNC" ||
            (e.competitor_name && e.competitor_name.startsWith("__ROUND_STATUS__"))
          ) {
            const targetId = e.competitor_name.replace("__ROUND_STATUS__", "");
            const status = e.note;
            if (targetId && status) {
              const cleanTarget = targetId.toLowerCase();
              roundStatusMap[cleanTarget] = status;
              const num = cleanTarget.replace(/\D/g, "");
              if (num) {
                roundStatusMap[`round-${num}`] = status;
                roundStatusMap[`r${num}`] = status;
                roundStatusMap[num] = status;
              }
            }
          } else {
            realEntries.push(e);
          }
        });
      }

      // 3. Merge live statuses from Firebase Firestore (never sleeps/pauses)
      if (isFirebaseConfigured()) {
        try {
          const snap = await getDoc(doc(db, "contests", "active"));
          if (snap.exists()) {
            const fbData = snap.data();
            Object.entries(fbData).forEach(([k, val]) => {
              if (k.startsWith("round_") && typeof val === "string") {
                const targetKey = k.replace("round_", "").toLowerCase();
                roundStatusMap[targetKey] = val;
                const num = targetKey.replace(/\D/g, "");
                if (num) {
                  roundStatusMap[`round-${num}`] = val;
                  roundStatusMap[`r${num}`] = val;
                  roundStatusMap[num] = val;
                }
              }
            });
          }
        } catch (err) {
          console.warn("[LOV Contest] Firebase getActiveContest notice:", err);
        }
      }

      if (!contest) return null;

      // Apply live round status signals to contest rounds
      const patchedRounds = (contest.rounds || []).map((r) => {
        const rId = String(r.id || "").toLowerCase();
        const rNum = String(r.round_number || "").replace(/\D/g, "");
        const liveStatus =
          roundStatusMap[rId] ||
          (rNum ? roundStatusMap[`round-${rNum}`] : null) ||
          (rNum ? roundStatusMap[`r${rNum}`] : null) ||
          (rNum ? roundStatusMap[rNum] : null) ||
          r.status;
        return {
          ...r,
          status: liveStatus,
        };
      });

      return {
        ...contest,
        rounds: patchedRounds,
        entries: realEntries,
      };
    } catch {
      return null;
    }
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

  // Update round status (Active, Upcoming, Completed) with live cloud broadcast
  async updateRoundStatus(roundId, status) {
    if (!roundId) return null;
    try {
      const cleanRoundId = String(roundId).toLowerCase();
      const numMatch = cleanRoundId.match(/\d+/);
      const roundNum = numMatch ? numMatch[0] : null;

      // 1. Sync to Firebase Firestore (instant 24/7 realtime cloud broadcast)
      if (isFirebaseConfigured()) {
        try {
          const contestDoc = doc(db, "contests", "active");
          await setDoc(contestDoc, {
            [`round_${cleanRoundId}`]: status,
            ...(roundNum ? { [`round_r${roundNum}`]: status, [`round_round-${roundNum}`]: status, [`round_${roundNum}`]: status } : {}),
            lastUpdated: Date.now(),
          }, { merge: true });
        } catch (fbErr) {
          console.warn("[LOV Contest] Firebase updateRoundStatus notice:", fbErr);
        }
      }

      // 2. Sync to Supabase
      if (isSupabaseConfigured()) {
        try {
          await supabase
            .from("contest_rounds")
            .update({ status })
            .eq("id", roundId);

          if (roundNum) {
            await supabase
              .from("contest_rounds")
              .update({ status })
              .eq("round_number", parseInt(roundNum, 10));
          }
        } catch (err) {
          console.warn("Direct update on contest_rounds notice:", err);
        }

        const { data: contestList } = await supabase
          .from("contests")
          .select("id")
          .order("created_at", { ascending: false })
          .limit(1);

        const targetContestId = contestList?.[0]?.id || "a1000000-0000-0000-0000-000000000001";
        if (targetContestId) {
          const signalKeys = [cleanRoundId];
          if (roundNum) {
            signalKeys.push(`round-${roundNum}`);
            signalKeys.push(`r${roundNum}`);
            signalKeys.push(roundNum);
          }
          const uniqueKeys = Array.from(new Set(signalKeys));

          for (const key of uniqueKeys) {
            await supabase.from("contest_entries").insert({
              contest_id: targetContestId,
              competitor_name: `__ROUND_STATUS__${key}`,
              role: "SYSTEM_SYNC",
              note: status,
              email: "system@lov.portal",
              is_member: false,
              votes: 0,
              round_scores: {},
            });
          }
        }
      }

      return { success: true };
    } catch (e) {
      console.warn("[LOV Contest] updateRoundStatus notice:", e);
      return null;
    }
  },

  // Real-time subscription to contest updates (Dual-channel: Firebase Firestore + Supabase)
  subscribeToContest(contestId, onUpdate) {
    const unsubscribes = [];

    // 1. Firebase Firestore Realtime listener (rock-solid, 24/7)
    if (isFirebaseConfigured()) {
      try {
        const unsubFb = onSnapshot(doc(db, "contests", "active"), () => {
          onUpdate();
        });
        unsubscribes.push(unsubFb);
      } catch (err) {
        console.warn("Firestore subscription notice:", err);
      }
    }

    // 2. Supabase Realtime channel listener
    if (isSupabaseConfigured()) {
      const channelName = `contest-realtime-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const channel = supabase
        .channel(channelName)
        .on("postgres_changes", { event: "*", schema: "public", table: "contest_entries" }, onUpdate)
        .on("postgres_changes", { event: "*", schema: "public", table: "contest_rounds" }, onUpdate)
        .on("postgres_changes", { event: "*", schema: "public", table: "contest_round_scores" }, onUpdate)
        .subscribe();

      unsubscribes.push(() => {
        try {
          supabase.removeChannel(channel);
        } catch (err) {
          console.warn("Unsubscribe notice:", err);
        }
      });
    }

    return () => {
      unsubscribes.forEach((unsub) => {
        try {
          unsub();
        } catch {}
      });
    };
  },
};
