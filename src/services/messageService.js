import { supabase, isSupabaseConfigured } from "../lib/supabase";

export const messageService = {
  // Fetch messages between two members
  async getMessages(userId1, userId2) {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
      .order("created_at", { ascending: true });

    if (error) return [];
    return data;
  },

  // Send message
  async sendMessage({ senderId, receiverId, text }) {
    if (!isSupabaseConfigured()) return null;

    const { data, error } = await supabase
      .from("messages")
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        text,
        read: false,
      })
      .select()
      .single();

    return { data, error };
  },

  // Real-time WebSocket listener for incoming messages
  subscribeToUserMessages(userId, onNewMessage) {
    if (!isSupabaseConfigured()) return () => {};

    const channel = supabase
      .channel(`user-messages-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${userId}`,
        },
        (payload) => {
          if (onNewMessage) onNewMessage(payload.new);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  },
};
