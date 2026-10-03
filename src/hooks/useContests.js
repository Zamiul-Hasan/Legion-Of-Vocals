import { useState, useEffect, useCallback } from "react";
import soloLevelingBanner from "../assets/images/temp/solo-leveling-banner.jpg";
import demonSlayerBanner from "../assets/images/temp/Demon-Slayer-banner.jpg";
import blueLockBanner from "../assets/images/temp/blue-lock-banner.jpg";
import { contestService } from "../services/contestService";
import { isSupabaseConfigured } from "../lib/supabase";

const STORAGE_KEY = "lov_contests_v3";
const SYNC_EVENT = "lov-contests-updated";

export const CONTEST_BANNER_PRESETS = [
  { label: "Solo Leveling Championship", url: soloLevelingBanner },
  { label: "Demon Slayer Showdown", url: demonSlayerBanner },
  { label: "Blue Lock Arena", url: blueLockBanner },
];

export function extractHashtags(text = "", requiredTag = "") {
  const matches = String(text).match(/#[a-zA-Z0-9_\u0980-\u09FF]+/g) || [];
  const normalized = matches.map((t) => t.toLowerCase());
  if (requiredTag) {
    const cleanReq = requiredTag.startsWith("#")
      ? requiredTag.toLowerCase()
      : `#${requiredTag.toLowerCase()}`;
    if (!normalized.includes(cleanReq)) {
      normalized.unshift(cleanReq);
    }
  }
  return Array.from(new Set(normalized));
}

export function getEntryPointsSummary(entry, rounds = []) {
  const roundScores = entry?.roundScores || {};
  let judgeTotal = 0;
  const perRound = {};

  if (Array.isArray(rounds) && rounds.length > 0) {
    rounds.forEach((r) => {
      const scoreObj = roundScores[r.id];
      const pts =
        typeof scoreObj === "number"
          ? scoreObj
          : Number(scoreObj?.total) || 0;
      perRound[r.id] = {
        vocal: Number(scoreObj?.vocal) || 0,
        sync: Number(scoreObj?.sync) || 0,
        emotion: Number(scoreObj?.emotion) || 0,
        bonus: Number(scoreObj?.bonus) || 0,
        total: pts,
        note: scoreObj?.note || "",
      };
      judgeTotal += pts;
    });
  } else {
    Object.entries(roundScores).forEach(([rId, scoreObj]) => {
      const pts =
        typeof scoreObj === "number"
          ? scoreObj
          : Number(scoreObj?.total) || 0;
      perRound[rId] = {
        total: pts,
        note: scoreObj?.note || "",
      };
      judgeTotal += pts;
    });
  }

  // Voting points are removed per contest rules; points are awarded exclusively by judges
  const votePoints = 0;
  const grandTotal = judgeTotal;

  return {
    perRound,
    judgeTotal,
    votePoints,
    grandTotal,
  };
}

const DEFAULT_CONTESTS = [
  {
    id: 1,
    title: "LOV Grand Bangla Anime Voice & Dubbing Championship 2026",
    subtitle: "Open to All LOV Members & Outsider Challengers",
    bannerImage: soloLevelingBanner,
    bannerCaption:
      "🔥 The biggest Bangla Anime Voice Acting & Dubbing Contest is LIVE! Both LOV Members and Outsider Challengers can register, compete across 3 knockout rounds, and use #lov_contest_round1 to get featured on the leaderboard!",
    prizePool: "৳15,000 BDT + Official LOV Studio Contract & Champion Badge",
    status: "Live Now",
    showBanner: true,
    officialHashtag: "#lov_contest_round1",
    activeRoundId: "round-1",
    createdAt: "September 2026",
    rounds: [
      {
        id: "round-1",
        roundNumber: 1,
        title: "Round 1: Open Audition & Character Monologue",
        hashtag: "#lov_contest_round1",
        status: "Active",
        deadline: "October 15, 2026",
        description:
          "Perform a 30–90 second Bangla dub of any iconic anime monologue or scene. Open to both LOV Members and Outsiders! Include #lov_contest_round1 in your submission caption.",
      },
      {
        id: "round-2",
        roundNumber: 2,
        title: "Round 2: Intense Battle & Lip-Sync Showdown",
        hashtag: "#lov_contest_round2",
        status: "Upcoming",
        deadline: "October 28, 2026",
        description:
          "Qualified contestants from Round 1 go head-to-head dubbing high-intensity anime battle scenes with frame-accurate lip-sync. Official tag: #lov_contest_round2",
      },
      {
        id: "round-3",
        roundNumber: 3,
        title: "Grand Finale: Live Director's Cut Challenge",
        hashtag: "#lov_contest_finale",
        status: "Upcoming",
        deadline: "November 10, 2026",
        description:
          "Top finalists perform a dramatic multi-emotion character scene judged by LOV Founders & community votes. Official tag: #lov_contest_finale",
      },
    ],
    entries: [],
  },
];

export function deduplicateContestEntries(entries = []) {
  const seenRoundParticipant = new Set();
  const cleaned = [];

  for (const entry of entries) {
    const cleanRound = entry.roundId || "round-1";
    const cleanLovId = (entry.lovId || "").trim().toLowerCase();
    const cleanEmail = (entry.email || "").trim().toLowerCase();
    const cleanName = (entry.participantName || "").trim().toLowerCase();
    const key = `${cleanRound}__${cleanLovId || cleanEmail || cleanName}`;

    if (!seenRoundParticipant.has(key)) {
      seenRoundParticipant.add(key);
      cleaned.push(entry);
    }
  }

  return cleaned;
}

function loadContests() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CONTESTS));
      return DEFAULT_CONTESTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return DEFAULT_CONTESTS;
    }
    // Ensure entries are deduplicated per round and have roundScores initialized
    return parsed.map((c) => ({
      ...c,
      entries: deduplicateContestEntries(c.entries || []).map((e) => {
        if (e.roundScores) return e;
        const fallbackDefault = DEFAULT_CONTESTS[0].entries.find(
          (de) => de.id === e.id
        );
        return {
          ...e,
          roundScores: fallbackDefault?.roundScores || {},
        };
      }),
    }));
  } catch {
    return DEFAULT_CONTESTS;
  }
}

function saveContests(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event(SYNC_EVENT));
  } catch {
    // ignore storage quota errors
  }
}

export function useContests() {
  const [contests, setContests] = useState(() => loadContests());

  useEffect(() => {
    // If Supabase is configured, fetch active contest from PostgreSQL
    if (isSupabaseConfigured()) {
      contestService.getActiveContest().then((dbContest) => {
        if (dbContest && dbContest.rounds && dbContest.rounds.length > 0) {
          const current = loadContests();
          const mappedRounds = dbContest.rounds.map((r) => ({
            id: r.id,
            roundNumber: r.round_number,
            title: r.title,
            hashtag: r.hashtag,
            deadline: r.deadline,
            status: r.status,
          }));

          const updated = current.map((c) => {
            if (c.id === 1 || c.id === "1" || c.showBanner) {
              return {
                ...c,
                title: dbContest.title || c.title,
                subtitle: dbContest.subtitle || c.subtitle,
                bannerCaption: dbContest.banner_caption || c.bannerCaption,
                prizePool: dbContest.prize_pool || c.prizePool,
                officialHashtag: dbContest.official_hashtag || c.officialHashtag,
                rounds: mappedRounds,
              };
            }
            return c;
          });
          setContests(updated);
          saveContests(updated);
        }
      }).catch(() => {});
    }

    const sync = () => setContests(loadContests());
    window.addEventListener(SYNC_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(SYNC_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // Currently featured / active contest for the Banner
  const activeContest =
    contests.find((c) => c.showBanner) || contests[0] || DEFAULT_CONTESTS[0];

  const activeRound =
    activeContest?.rounds?.find((r) => r.id === activeContest.activeRoundId) ||
    activeContest?.rounds?.find((r) => r.status === "Active") ||
    activeContest?.rounds?.[0];

  // Launch a brand new contest
  const launchNewContest = useCallback((contestData) => {
    const current = loadContests();
    const newId =
      current.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;

    const initialRounds =
      Array.isArray(contestData.rounds) && contestData.rounds.length > 0
        ? contestData.rounds
        : [
            {
              id: "round-1",
              roundNumber: 1,
              title: "Round 1: Open Audition",
              hashtag: contestData.officialHashtag || "#lov_contest_round1",
              status: "Active",
              deadline: contestData.deadline || "Upcoming",
              description:
                contestData.roundDescription ||
                "Open to all LOV Members and Outsiders! Submit your entry with the official round hashtag.",
            },
          ];

    const newContest = {
      id: newId,
      title: contestData.title?.trim() || "New LOV Dubbing Contest",
      subtitle:
        contestData.subtitle?.trim() ||
        "Open to All LOV Members & Outsider Challengers",
      bannerImage: contestData.bannerImage || soloLevelingBanner,
      bannerCaption:
        contestData.bannerCaption?.trim() ||
        "🔥 New LOV Contest is now live! Register as a Member or Outsider and tag your submission!",
      prizePool:
        contestData.prizePool?.trim() || "Official LOV Champion Trophy & Rewards",
      status: contestData.status || "Live Now",
      showBanner: contestData.showBanner !== false,
      officialHashtag:
        initialRounds[0]?.hashtag ||
        contestData.officialHashtag ||
        "#lov_contest_round1",
      activeRoundId: initialRounds[0]?.id || "round-1",
      createdAt: "Just now",
      rounds: initialRounds,
      entries: [],
    };

    const updated = [
      newContest,
      ...current.map((c) =>
        newContest.showBanner ? { ...c, showBanner: false } : c
      ),
    ];
    saveContests(updated);
    setContests(updated);
    return newContest;
  }, []);

  // Update active contest banner, caption, status, or visibility
  const updateContestBanner = useCallback((contestId, updates) => {
    const current = loadContests();
    const updated = current.map((contest) => {
      if (Number(contest.id) !== Number(contestId)) {
        return updates.showBanner ? { ...contest, showBanner: false } : contest;
      }
      return {
        ...contest,
        ...updates,
      };
    });
    saveContests(updated);
    setContests(updated);
  }, []);

  // Add a new round to a contest
  const addRound = useCallback((contestId, roundData) => {
    const current = loadContests();
    const updated = current.map((contest) => {
      if (Number(contest.id) !== Number(contestId)) return contest;
      const nextRoundNum = (contest.rounds?.length || 0) + 1;
      const rawTag =
        roundData.hashtag?.trim() || `#lov_contest_round${nextRoundNum}`;
      const formattedTag = rawTag.startsWith("#")
        ? rawTag.toLowerCase().replace(/\s+/g, "_")
        : `#${rawTag.toLowerCase().replace(/\s+/g, "_")}`;

      const newRound = {
        id: `round-${Date.now()}`,
        roundNumber: Number(roundData.roundNumber) || nextRoundNum,
        title:
          roundData.title?.trim() ||
          `Round ${nextRoundNum}: Knockout Stage`,
        hashtag: formattedTag,
        status: roundData.status || "Upcoming",
        deadline: roundData.deadline?.trim() || "TBA",
        description:
          roundData.description?.trim() ||
          `Compete in Round ${nextRoundNum} using the official hashtag ${formattedTag}.`,
      };

      const makeActive = newRound.status === "Active";
      const nextRounds = (contest.rounds || []).map((r) =>
        makeActive && r.status === "Active" ? { ...r, status: "Completed" } : r
      );

      return {
        ...contest,
        activeRoundId: makeActive ? newRound.id : contest.activeRoundId,
        officialHashtag: makeActive ? newRound.hashtag : contest.officialHashtag,
        rounds: [...nextRounds, newRound],
      };
    });
    saveContests(updated);
    setContests(updated);
  }, []);

  // Switch active round
  const setActiveRound = useCallback((contestId, roundId) => {
    const current = loadContests();
    const updated = current.map((contest) => {
      if (Number(contest.id) !== Number(contestId)) return contest;
      let nextHashtag = contest.officialHashtag;
      const updatedRounds = (contest.rounds || []).map((r) => {
        if (r.id === roundId) {
          nextHashtag = r.hashtag;
          return { ...r, status: "Active" };
        }
        return r.status === "Active" ? { ...r, status: "Completed" } : r;
      });
      return {
        ...contest,
        activeRoundId: roundId,
        officialHashtag: nextHashtag,
        rounds: updatedRounds,
      };
    });
    saveContests(updated);
    setContests(updated);
  }, []);

  // Delete a round
  const deleteRound = useCallback((contestId, roundId) => {
    const current = loadContests();
    const updated = current.map((contest) => {
      if (Number(contest.id) !== Number(contestId)) return contest;
      if ((contest.rounds || []).length <= 1) return contest;
      const remaining = contest.rounds.filter((r) => r.id !== roundId);
      const nextActive =
        remaining.find((r) => r.status === "Active") || remaining[0];
      return {
        ...contest,
        activeRoundId: nextActive.id,
        officialHashtag: nextActive.hashtag,
        rounds: remaining,
      };
    });
    saveContests(updated);
    setContests(updated);
  }, []);

  // Register & Submit an Entry (works for both LOV Members and Outsiders)
  const registerAndSubmitEntry = useCallback((contestId, entryData) => {
    const current = loadContests();
    let createdEntry = null;

    const updated = current.map((contest) => {
      if (Number(contest.id) !== Number(contestId)) return contest;

      const targetRound =
        contest.rounds?.find((r) => r.id === entryData.roundId) ||
        contest.rounds?.find((r) => r.id === contest.activeRoundId) ||
        contest.rounds?.[0];

      const roundTag =
        targetRound?.hashtag || contest.officialHashtag || "#lov_contest_round1";

      const hashtags = extractHashtags(entryData.caption || "", roundTag);
      const captionWithTag = (entryData.caption || "").toLowerCase().includes(roundTag.toLowerCase())
        ? entryData.caption.trim()
        : `${(entryData.caption || "").trim()} ${roundTag}`.trim();

      // Prevent duplicate submissions in the same round
      const cleanRoundId = targetRound?.id || "round-1";
      const cleanName = (entryData.participantName || "").trim().toLowerCase();
      const cleanEmail = (entryData.email || "").trim().toLowerCase();
      const cleanLovId = (entryData.lovId || "").trim().toLowerCase();

      const alreadySubmitted = (contest.entries || []).some((e) => {
        if (e.roundId !== cleanRoundId) return false;
        if (cleanLovId && (e.lovId || "").toLowerCase() === cleanLovId) return true;
        if (cleanEmail && (e.email || "").toLowerCase() === cleanEmail) return true;
        return (e.participantName || "").trim().toLowerCase() === cleanName;
      });

      if (alreadySubmitted) {
        throw new Error(
          `You have already submitted an entry for Round ${
            targetRound?.roundNumber || 1
          }. Each participant is limited to 1 submission per round.`
        );
      }

      // Reuse existing contestant code if participant competed in another round
      const existingCompetitor = (contest.entries || []).find((e) => {
        if (cleanLovId && (e.lovId || "").toLowerCase() === cleanLovId) return true;
        if (cleanEmail && (e.email || "").toLowerCase() === cleanEmail) return true;
        return (e.participantName || "").trim().toLowerCase() === cleanName;
      });

      const nextNum = 101 + (contest.entries?.length || 0);
      const contestantCode =
        existingCompetitor?.contestantCode || `LOV-C2026-${nextNum}`;

      const uploadedImages = Array.isArray(entryData.images)
        ? entryData.images.filter(Boolean)
        : [];

      createdEntry = {
        id: Date.now(),
        contestId: contest.id,
        roundId: targetRound?.id || "round-1",
        roundNumber: targetRound?.roundNumber || 1,
        contestantCode,
        participantName: entryData.participantName.trim(),
        participantType: entryData.participantType || "Outsider", // "LOV Member" | "Outsider"
        lovId:
          entryData.participantType === "LOV Member"
            ? entryData.lovId || "LOV-2026-MEM"
            : null,
        roleCategory:
          entryData.roleCategory ||
          (entryData.participantType === "LOV Member"
            ? "Voice Actor"
            : "Challenger (Outsider)"),
        email: entryData.email?.trim() || "",
        socialLink:
          entryData.socialLink?.trim() ||
          "https://www.facebook.com/share/g/19MxBAkZsX/",
        avatar:
          entryData.avatar ||
          `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(
            entryData.participantName.trim()
          )}`,
        characterAndAnime:
          entryData.characterAndAnime?.trim() || "Original Bangla Anime Dub",
        videoUrl: entryData.videoUrl || "",
        images: uploadedImages,
        bannerThumb:
          uploadedImages[0] || entryData.bannerThumb || contest.bannerImage,
        caption: captionWithTag,
        hashtags,
        votes: 1,
        likedByMe: true,
        status: "Registered",
        submittedAt: "Just now",
        roundScores: {},
      };

      return {
        ...contest,
        entries: [createdEntry, ...(contest.entries || [])],
      };
    });

    saveContests(updated);
    setContests(updated);
    return createdEntry;
  }, []);

  // Vote / React on a Contest Entry
  const voteEntry = useCallback((contestId, entryId) => {
    const current = loadContests();
    const updated = current.map((contest) => {
      if (Number(contest.id) !== Number(contestId)) return contest;
      return {
        ...contest,
        entries: (contest.entries || []).map((entry) => {
          if (Number(entry.id) !== Number(entryId)) return entry;
          const nextLiked = !entry.likedByMe;
          return {
            ...entry,
            likedByMe: nextLiked,
            votes: Math.max(0, (entry.votes || 0) + (nextLiked ? 1 : -1)),
          };
        }),
      };
    });
    saveContests(updated);
    setContests(updated);
  }, []);

  // Admin: Update entry qualification status ("Registered" | "Qualified" | "Winner 🏆")
  const updateEntryStatus = useCallback((contestId, entryId, nextStatus) => {
    const current = loadContests();
    const updated = current.map((contest) => {
      if (Number(contest.id) !== Number(contestId)) return contest;
      return {
        ...contest,
        entries: (contest.entries || []).map((entry) =>
          Number(entry.id) === Number(entryId)
            ? { ...entry, status: nextStatus }
            : entry
        ),
      };
    });
    saveContests(updated);
    setContests(updated);
  }, []);

  // Admin: Award or update points for a contestant in a specific round
  const awardRoundPoints = useCallback(
    (contestId, entryId, roundId, scoreData) => {
      const current = loadContests();
      const updated = current.map((contest) => {
        if (Number(contest.id) !== Number(contestId)) return contest;
        return {
          ...contest,
          entries: (contest.entries || []).map((entry) => {
            if (Number(entry.id) !== Number(entryId)) return entry;
            const prevRoundScores = entry.roundScores || {};
            const vocal = Number(scoreData.vocal) || 0;
            const sync = Number(scoreData.sync) || 0;
            const emotion = Number(scoreData.emotion) || 0;
            const bonus = Number(scoreData.bonus) || 0;
            const computedTotal =
              scoreData.total !== undefined
                ? Number(scoreData.total)
                : vocal + sync + emotion + bonus;

            return {
              ...entry,
              roundScores: {
                ...prevRoundScores,
                [roundId]: {
                  vocal,
                  sync,
                  emotion,
                  bonus,
                  total: Math.max(0, computedTotal),
                  note: scoreData.note || "",
                },
              },
            };
          }),
        };
      });
      saveContests(updated);
      setContests(updated);
    },
    []
  );

  // Admin: Quick + / - or direct points adjustment for a round
  const quickAdjustRoundPoints = useCallback(
    (contestId, entryId, roundId, delta) => {
      const current = loadContests();
      const updated = current.map((contest) => {
        if (Number(contest.id) !== Number(contestId)) return contest;
        return {
          ...contest,
          entries: (contest.entries || []).map((entry) => {
            if (Number(entry.id) !== Number(entryId)) return entry;
            const prevRoundScores = entry.roundScores || {};
            const existing = prevRoundScores[roundId] || {
              vocal: 30,
              sync: 25,
              emotion: 25,
              bonus: 0,
              total: 0,
              note: "",
            };
            const prevTotal =
              typeof existing === "number"
                ? existing
                : Number(existing.total) || 0;
            const nextTotal = Math.max(0, prevTotal + Number(delta));
            return {
              ...entry,
              roundScores: {
                ...prevRoundScores,
                [roundId]: {
                  ...(typeof existing === "object" ? existing : {}),
                  total: nextTotal,
                },
              },
            };
          }),
        };
      });
      saveContests(updated);
      setContests(updated);
    },
    []
  );

  return {
    contests,
    activeContest,
    activeRound,
    launchNewContest,
    updateContestBanner,
    addRound,
    setActiveRound,
    deleteRound,
    registerAndSubmitEntry,
    voteEntry,
    updateEntryStatus,
    awardRoundPoints,
    quickAdjustRoundPoints,
  };
}
