import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MessageCircle,
  X,
  Minus,
  Send,
  ThumbsUp,
  Smile,
  Image as ImageIcon,
  Phone,
  Video,
  Maximize2,
  Search,
  ChevronLeft,
  CheckCheck,
} from "lucide-react";
import { useMessenger, OPEN_CHAT_EVENT } from "../../hooks/useMessenger";

const MSG_REACTIONS = ["❤️", "🔥", "😂", "😮", "👍", "👏"];
const QUICK_EMOJIS = ["🎙️", "🎬", "🔥", "❤️", "😂", "👏", "✨", "🚀"];

export default function FloatingMessenger() {
  const location = useLocation();
  const {
    contacts,
    totalUnread,
    typingUser,
    sendMessage,
    reactToMessage,
    markThreadRead,
  } = useMessenger();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeUsername, setActiveUsername] = useState("voiceactor01");
  const [viewMode, setViewMode] = useState("chat"); // 'list' | 'chat'
  const [search, setSearch] = useState("");
  const [inputText, setInputText] = useState("");
  const [showEmojiBar, setShowEmojiBar] = useState(false);
  const [callStatus, setCallStatus] = useState("");

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Listen for global "openChatWithMember" events from Team cards, Profile banners, Navbar, etc.
  useEffect(() => {
    const handleOpenChat = (e) => {
      const targetUser = e.detail?.username;
      setIsOpen(true);
      setIsMinimized(false);
      if (targetUser) {
        setActiveUsername(targetUser);
        setViewMode("chat");
        markThreadRead(targetUser);
      } else {
        setViewMode("list");
      }
    };
    window.addEventListener(OPEN_CHAT_EVENT, handleOpenChat);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, handleOpenChat);
  }, [markThreadRead]);

  const activeContact =
    (contacts && contacts.length > 0)
      ? contacts.find(
          (c) =>
            c?.username &&
            String(c.username).toLowerCase() === String(activeUsername || "").toLowerCase()
        ) ||
        contacts[0]
      : null;

  useEffect(() => {
    if (isOpen && !isMinimized && viewMode === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [
    isOpen,
    isMinimized,
    viewMode,
    activeContact?.messages?.length,
    typingUser,
  ]);

  // Hide floating widget on the dedicated /messages page so it doesn't overlap
  if (location.pathname === "/messages") return null;

  const handleSelectContact = (username) => {
    if (!username) return;
    setActiveUsername(username);
    setViewMode("chat");
    markThreadRead(username);
  };

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim() || !activeContact) return;
    sendMessage(activeContact.username, inputText);
    setInputText("");
    setShowEmojiBar(false);
  };

  const handleQuickThumb = () => {
    if (!activeContact) return;
    sendMessage(activeContact.username, "👍");
  };

  const handleAttachment = (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeContact) return;
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          sendMessage(activeContact.username, "📷 Sent a studio photo", {
            type: "image",
            url: reader.result,
            name: file.name,
          });
        }
      };
      reader.readAsDataURL(file);
    } else {
      sendMessage(
        activeContact.username,
        `🎙️ Attached audio/file: ${file.name}`
      );
    }
  };

  const triggerCallToast = (type) => {
    if (!activeContact) return;
    setCallStatus(`Starting ${type} with ${activeContact.displayName || "Member"}...`);
    setTimeout(() => setCallStatus(""), 3000);
  };

  const filteredContacts = (contacts || []).filter((c) => {
    if (!c) return false;
    const q = (search || "").toLowerCase();
    const dName = String(c.displayName || "").toLowerCase();
    const fName = String(c.fullName || "").toLowerCase();
    const uName = String(c.username || "").toLowerCase();
    const lId = String(c.lovId || "").toLowerCase();
    return dName.includes(q) || fName.includes(q) || uName.includes(q) || lId.includes(q);
  });

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Minimized or Closed Floating Bubble */}
      {(!isOpen || isMinimized) && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
            if (activeContact) markThreadRead(activeContact.username);
          }}
          className="group relative flex items-center gap-3 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:scale-105 transition cursor-pointer"
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6 text-slate-950 fill-slate-950/10" />
            {totalUnread > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[11px] font-black flex items-center justify-center shadow">
                {totalUnread}
              </span>
            )}
          </div>
          <span className="text-sm font-extrabold hidden sm:inline">
            {isMinimized
              ? `Chat: ${activeContact?.displayName || "Member"}`
              : "LOV Messenger"}
          </span>
        </button>
      )}

      {/* Open Facebook Messenger-Style Chat Box */}
      {isOpen && !isMinimized && activeContact && (
        <div className="w-[350px] sm:w-[380px] h-[520px] rounded-3xl bg-slate-900 border border-cyan-500/40 shadow-2xl shadow-cyan-950/70 flex flex-col overflow-hidden text-white">
          {/* Top Bar */}
          {viewMode === "chat" ? (
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition cursor-pointer"
                  title="All Conversations"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <Link
                  to={`/team/${activeContact.username}`}
                  className="relative shrink-0"
                >
                  <img
                    src={activeContact.avatar}
                    alt={activeContact.displayName}
                    className="w-9 h-9 rounded-full object-cover border border-cyan-400 bg-slate-900"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-slate-950 ${
                      activeContact.online ? "bg-emerald-400" : "bg-slate-500"
                    }`}
                  />
                </Link>

                <div className="min-w-0">
                  <Link
                    to={`/team/${activeContact.username}`}
                    className="text-sm font-bold text-white hover:text-cyan-400 truncate block"
                  >
                    {activeContact.fullName || activeContact.displayName}
                  </Link>
                  <p className="text-[10px] text-cyan-400 font-mono truncate">
                    {activeContact.lovId || "LOV Member"} •{" "}
                    {activeContact.online ? "Active now" : activeContact.role}
                  </p>
                </div>
              </div>

              {/* Header Icons (Call, Video, Fullscreen, Minimize, Close) */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => triggerCallToast("Voice Call")}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-cyan-400 transition cursor-pointer"
                  title="Voice Call"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => triggerCallToast("Studio Video Call")}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-cyan-400 transition cursor-pointer"
                  title="Video Call"
                >
                  <Video className="w-4 h-4" />
                </button>
                <Link
                  to={`/messages?user=${activeContact.username}`}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
                  title="Open Full Messenger"
                >
                  <Maximize2 className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setIsMinimized(true)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                  title="Minimize"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400 transition cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Contacts List Header */
            <div className="px-4 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">
                  LOV Messenger
                </h3>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  to="/messages"
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-cyan-400 text-xs font-semibold flex items-center gap-1"
                  title="Expand Full View"
                >
                  <Maximize2 className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Call Toast */}
          {callStatus && (
            <div className="px-4 py-2 bg-cyan-500/20 border-b border-cyan-500/30 text-xs text-cyan-300 font-semibold text-center animate-pulse">
              📞 {callStatus}
            </div>
          )}

          {/* Body: Either Contact List or Active Conversation */}
          {viewMode === "list" ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-3 border-b border-slate-800">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search member or LOV-ID..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
                {filteredContacts.map((contact) => (
                  <button
                    key={contact.username}
                    type="button"
                    onClick={() => handleSelectContact(contact.username)}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-800/70 transition text-left cursor-pointer"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={contact.avatar}
                        alt={contact.displayName}
                        className="w-11 h-11 rounded-full object-cover border border-cyan-500/40 bg-slate-950"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${
                          contact.online ? "bg-emerald-400" : "bg-slate-500"
                        }`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white truncate">
                          {contact.fullName || contact.displayName}
                        </h4>
                        <span className="text-[10px] text-slate-500">
                          {contact.lastMessage?.time || ""}
                        </span>
                      </div>
                      <p className="text-[11px] text-cyan-400 font-mono">
                        {contact.lovId} • {contact.department}
                      </p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {contact.lastMessage
                          ? contact.lastMessage.text
                          : "Start a studio conversation..."}
                      </p>
                    </div>

                    {contact.unread > 0 && (
                      <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-black flex items-center justify-center shrink-0">
                        {contact.unread}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Messages Scroll Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/60">
                {/* Mini Profile Card at top of thread */}
                <div className="text-center py-3 border-b border-slate-800/70 mb-2">
                  <img
                    src={activeContact.avatar}
                    alt={activeContact.displayName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-cyan-400 mx-auto bg-slate-900"
                  />
                  <h4 className="text-sm font-bold text-white mt-2">
                    {activeContact.fullName}
                  </h4>
                  <p className="text-[11px] text-cyan-400 font-mono">
                    {activeContact.lovId} • {activeContact.role}
                  </p>
                </div>

                {(activeContact.messages || []).map((msg) => {
                  const isMe = msg.sender === "me";
                  return (
                    <div
                      key={msg.id}
                      className={`group flex flex-col ${
                        isMe ? "items-end" : "items-start"
                      }`}
                    >
                      <div className="relative max-w-[82%]">
                        {/* Hover Message Reaction Bar (Messenger style) */}
                        <div
                          className={`opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 ${
                            isMe ? "right-0" : "left-0"
                          } z-20 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 shadow-lg`}
                        >
                          {MSG_REACTIONS.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() =>
                                reactToMessage(
                                  activeContact.username,
                                  msg.id,
                                  emoji
                                )
                              }
                              className="hover:scale-125 transition text-xs px-0.5 cursor-pointer"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>

                        <div
                          className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                            isMe
                              ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-semibold rounded-br-xs"
                              : "bg-slate-800 text-slate-100 border border-slate-700/80 rounded-bl-xs"
                          }`}
                        >
                          {msg.attachment?.type === "image" && (
                            <img
                              src={msg.attachment.url}
                              alt="attachment"
                              className="rounded-xl max-h-40 object-cover mb-1.5"
                            />
                          )}
                          <p>{msg.text}</p>
                        </div>

                        {/* Reaction Pill on Message */}
                        {msg.reaction && (
                          <span
                            className={`absolute -bottom-2.5 ${
                              isMe ? "left-2" : "right-2"
                            } px-1.5 py-0.2 rounded-full bg-slate-900 border border-slate-700 text-[11px] shadow`}
                          >
                            {msg.reaction}
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] text-slate-500 mt-1 px-1 flex items-center gap-1">
                        {msg.time}
                        {isMe && (
                          <CheckCheck className="w-3 h-3 text-cyan-400" />
                        )}
                      </span>
                    </div>
                  );
                })}

                {/* Typing Indicator */}
                {typingUser === activeContact.username && (
                  <div className="flex items-center gap-2 text-xs text-cyan-400">
                    <div className="px-3.5 py-2 rounded-2xl bg-slate-800 border border-slate-700 inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:300ms]" />
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {activeContact.displayName} is typing...
                    </span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Emoji Bar */}
              {showEmojiBar && (
                <div className="px-3 py-1.5 bg-slate-900 border-t border-slate-800 flex items-center justify-around">
                  {QUICK_EMOJIS.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setInputText((prev) => prev + em)}
                      className="text-base hover:scale-125 transition cursor-pointer"
                    >
                      {em}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Footer */}
              <form
                onSubmit={handleSend}
                className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center gap-1.5"
              >
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-full text-cyan-400 hover:bg-slate-800 transition cursor-pointer"
                  title="Send Photo or Audio Stem"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,audio/*"
                  onChange={handleAttachment}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => setShowEmojiBar((prev) => !prev)}
                  className="p-2 rounded-full text-cyan-400 hover:bg-slate-800 transition cursor-pointer"
                  title="Emojis"
                >
                  <Smile className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Message ${activeContact.displayName}...`}
                  className="flex-1 px-3.5 py-2 rounded-full bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />

                {inputText.trim() ? (
                  <button
                    type="submit"
                    className="p-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition cursor-pointer"
                    title="Send Message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleQuickThumb}
                    className="p-2 rounded-full text-cyan-400 hover:bg-slate-800 transition cursor-pointer"
                    title="Send Thumbs Up"
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                )}
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
