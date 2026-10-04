import { supabase, isSupabaseConfigured } from "../lib/supabase";
import defaultMembers from "../data/members";

export const memberService = {
  // Convert Base64 Data URL to Blob for Supabase Storage
  dataUrlToBlob(dataUrl) {
    try {
      if (!dataUrl || !dataUrl.startsWith("data:")) return null;
      const parts = dataUrl.split(",");
      const mimeMatch = parts[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
      const bstr = atob(parts[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    } catch {
      return null;
    }
  },

  // Upload an avatar/cover image directly to Supabase Storage bucket
  async uploadToStorage(bucketName, filePath, dataUrl) {
    try {
      const blob = this.dataUrlToBlob(dataUrl);
      if (!blob) return null;

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, blob, {
          contentType: blob.type || "image/jpeg",
          upsert: true,
        });

      if (!error && data?.path) {
        const { data: publicData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(data.path);
        return publicData?.publicUrl || null;
      }
    } catch (e) {
      console.warn(`[LOV Storage] Upload to ${bucketName} error:`, e);
    }
    return null;
  },

  // Fetch all members with points ranking
  async getMembers() {
    if (!isSupabaseConfigured()) {
      return defaultMembers;
    }

    try {
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
        level: p.level || 1,
        avatar: p.avatar_url,
        cover: p.cover_url,
        bio: p.bio,
        stats: p.stats || { projects: 0, dubVideos: 0, points: p.points || 100 },
      }));
    } catch {
      return defaultMembers;
    }
  },

  // Lookup member by unique LOV ID
  async getMemberByLovId(lovId) {
    if (!isSupabaseConfigured()) {
      return defaultMembers.find((m) => m.lovId?.toUpperCase() === lovId?.toUpperCase());
    }

    try {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .ilike("lov_id", lovId)
        .single();

      return data;
    } catch {
      return null;
    }
  },

  // Update profile avatar picture permanently to cloud storage & database
  async updateAvatar(memberOrId, avatarUrl) {
    if (!isSupabaseConfigured() || !avatarUrl) {
      return { success: true };
    }

    const member = typeof memberOrId === "object" ? memberOrId : { id: memberOrId };
    const cleanId = String(member.id || "").trim();
    const cleanUsername = String(member.username || cleanId).toLowerCase().trim();
    const isFounder =
      cleanId === "1" ||
      cleanUsername === "ovi" ||
      cleanUsername === "zamiul" ||
      member.email === "zamiulhasan6@gmail.com";

    // 1. Try uploading to Supabase Storage bucket "avatars" for a global CDN URL
    let finalUrl = avatarUrl;
    if (avatarUrl.startsWith("data:")) {
      const fileName = `avatar_${cleanUsername || "user"}_${Date.now()}.jpg`;
      const uploadedUrl = await this.uploadToStorage("avatars", fileName, avatarUrl);
      if (uploadedUrl) {
        finalUrl = uploadedUrl;
      }
    }

    // 2. Sync to Supabase Auth user metadata if logged in
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user) {
        await supabase.auth.updateUser({
          data: { avatar_url: finalUrl },
        });
      }
    } catch {
      // ignore
    }

    // 3. Upsert / update profiles table in PostgreSQL so all visitors and devices see it
    try {
      let query = supabase.from("profiles").update({
        avatar_url: finalUrl,
        updated_at: new Date().toISOString(),
      });

      if (isFounder) {
        query = query.or("lov_id.eq.LOV-2026-0001,username.eq.ovi,email.eq.zamiulhasan6@gmail.com");
      } else if (member.lovId) {
        query = query.eq("lov_id", member.lovId);
      } else if (member.username) {
        query = query.eq("username", member.username);
      } else if (cleanId && cleanId.length > 20) {
        query = query.eq("id", cleanId);
      }

      const { data: updateData, error: updateErr } = await query.select();

      // If no existing row was updated, upsert the profile
      if (!updateErr && (!updateData || updateData.length === 0)) {
        await supabase.from("profiles").upsert(
          {
            lov_id: member.lovId || (isFounder ? "LOV-2026-0001" : `LOV-${Date.now().toString().slice(-4)}`),
            full_name: member.fullName || (isFounder ? "MD Zamiul Hasan" : member.username),
            display_name: member.displayName || member.fullName || (isFounder ? "MD Zamiul Hasan" : member.username),
            username: member.username || (isFounder ? "ovi" : "user"),
            email: member.email || (isFounder ? "zamiulhasan6@gmail.com" : `${member.username}@gmail.com`),
            role: member.role || (isFounder ? "Founder" : "Member"),
            department: member.department || (isFounder ? "Management" : "Voice Acting"),
            avatar_url: finalUrl,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "lov_id" }
        );
      }
    } catch (e) {
      console.warn("[LOV Service] Supabase profiles avatar update error:", e);
    }

    return { success: true, avatarUrl: finalUrl };
  },

  // Update profile cover photo permanently to cloud storage & database
  async updateCover(memberOrId, coverUrl) {
    if (!isSupabaseConfigured() || !coverUrl) {
      return { success: true };
    }

    const member = typeof memberOrId === "object" ? memberOrId : { id: memberOrId };
    const cleanId = String(member.id || "").trim();
    const cleanUsername = String(member.username || cleanId).toLowerCase().trim();
    const isFounder =
      cleanId === "1" ||
      cleanUsername === "ovi" ||
      cleanUsername === "zamiul" ||
      member.email === "zamiulhasan6@gmail.com";

    // 1. Try uploading to Supabase Storage bucket "covers"
    let finalUrl = coverUrl;
    if (coverUrl.startsWith("data:")) {
      const fileName = `cover_${cleanUsername || "user"}_${Date.now()}.jpg`;
      const uploadedUrl = await this.uploadToStorage("covers", fileName, coverUrl);
      if (uploadedUrl) {
        finalUrl = uploadedUrl;
      }
    }

    // 2. Sync to profiles table
    try {
      let query = supabase.from("profiles").update({
        cover_url: finalUrl,
        updated_at: new Date().toISOString(),
      });

      if (isFounder) {
        query = query.or("lov_id.eq.LOV-2026-0001,username.eq.ovi,email.eq.zamiulhasan6@gmail.com");
      } else if (member.lovId) {
        query = query.eq("lov_id", member.lovId);
      } else if (member.username) {
        query = query.eq("username", member.username);
      } else if (cleanId && cleanId.length > 20) {
        query = query.eq("id", cleanId);
      }

      await query;
    } catch (e) {
      console.warn("[LOV Service] Supabase profiles cover update error:", e);
    }

    return { success: true, coverUrl: finalUrl };
  },
};

