import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  MessageCircle,
  Search,
  Send,
  ThumbsUp,
  Smile,
  Image as ImageIcon,
  Phone,
  Video,
  Info,
  CheckCheck,
  ExternalLink,
  Sparkles,
  Fingerprint,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useMessenger } from "../hooks/useMessenger";

const MSG_REACTIONS = ["❤️", "🔥", "😂", "😮", "👍", "👏"];
const QUICK_PROMPTS = [
  "🎙️ Can you upload the 48kHz vocal stem for Episode 2?",
  "🎬 Your dubbing take has been approved by QA!",
  "🔥 Ready for tonight's live voice direction session?",
];

export default function Messages() {
  const [searchParams] = useSearchParams();
  const initialUser = searchParams.get("user") || "voiceactor01";

  const {
    contacts,
    typingUser,
    sendMessage,
    reactToMessage,
    markThreadRead,
  } = useMessenger();

  const [activeUsername, setActiveUsername] = useState(initialUser);
  const [search, setSearch] = useState("");
  const [inputText, setInputText] = useState("");
  const [showInfoPanel, setShowInfoPanel] = useState(true);
  const [callBanner, setCallBanner] = useState("");

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const paramUser = searchParams.get("user");
    if (paramUser) {
      setActiveUsername(paramUser);
      markThreadRead(paramUser);
    }
  }, [searchParams]);

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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeContact?.messages?.length, typingUser, activeUsername]);

  const handleSelectContact = (username) => {
    if (!username) return;
    setActiveUsername(username);
    markThreadRead(username);
  };

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim() || !activeContact) return;
    sendMessage(activeContact.username, inputText);
    setInputText("");
  };

  const handleAttachment = (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeContact) return;
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          sendMessage(activeContact.username, "📷 Sent a studio image", {
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
        `🎙️ Attached studio file: ${file.name}`
      );
    }
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
    <DashboardLayout>
      <div className="h-[calc(100vh-130px)] min-h-[600px] rounded-3xl bg-slate-900 border border-cyan-500/25 overflow-hidden flex text-white shadow-2xl">
        {/* Left Column: Messenger Contacts & Threads */}
        <div className="w-80 border-r border-slate-800 flex flex-col bg-slate-950/60 shrink-0">
          <div className="p-4 border-b border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-xl font-bold flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-cyan-400" />
                LOV Messenger
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-[11px] font-bold text-cyan-400">
                {contacts.length} Members
              </span>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or LOV-ID..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Active Now Horizontal Strip (like Facebook Messenger) */}
          <div className="px-4 py-3 border-b border-slate-800/80 flex items-center gap-3 overflow-x-auto">
            {contacts.map((c) => (
              <button
                key={c.username}
                type="button"
                onClick={() => handleSelectContact(c.username)}
                className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
              >
                <div className="relative">
                  <img
                    src={c.avatar}
                    alt={c.displayName}
                    className={`w-10 h-10 rounded-full object-cover border-2 transition ${
                      activeContact?.username === c.username
                        ? "border-cyan-400 scale-105"
                        : "border-slate-700 group-hover:border-cyan-400"
                    }`}
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-slate-950 ${
                      c.online ? "bg-emerald-400" : "bg-slate-500"
                    }`}
                  />
                </div>
                <span className="text-[10px] text-slate-300 truncate max-w-[54px]">
                  {c.displayName}
                </span>
              </button>
            ))}
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50">
            {filteredContacts.map((contact) => {
              const isSelected = activeContact?.username === contact.username;
              return (
                <button
                  key={contact.username}
                  type="button"
                  onClick={() => handleSelectContact(contact.username)}
                  className={`w-full p-3.5 flex items-center gap-3 text-left transition cursor-pointer ${
                    isSelected
                      ? "bg-cyan-500/15 border-l-4 border-cyan-400"
                      : "hover:bg-slate-900/80"
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={contact.avatar}
                      alt={contact.displayName}
                      className="w-12 h-12 rounded-full object-cover border border-cyan-500/40 bg-slate-900"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-950 ${
                        contact.online ? "bg-emerald-400" : "bg-slate-500"
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white truncate">
                        {contact.fullName || contact.displayName}
                      </h3>
                      <span className="text-[10px] text-slate-500">
                        {contact.lastMessage?.time || ""}
                      </span>
                    </div>
                    <p className="text-[11px] text-cyan-400 font-mono truncate">
                      {contact.lovId} • {contact.role}
                    </p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {contact.lastMessage
                        ? contact.lastMessage.text
                        : "Click to start chatting..."}
                    </p>
                  </div>

                  {contact.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-black flex items-center justify-center shrink-0">
                      {contact.unread}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Column: Active Chat Window */}
        {activeContact && (
          <div className="flex-1 flex flex-col bg-slate-950/30 min-w-0">
            {/* Chat Header */}
            <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative">
                  <img
                    src={activeContact.avatar}
                    alt={activeContact.displayName}
                    className="w-11 h-11 rounded-full object-cover border-2 border-cyan-400 bg-slate-950"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${
                      activeContact.online ? "bg-emerald-400" : "bg-slate-500"
                    }`}
                  />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-white truncate">
                    {activeContact.fullName || activeContact.displayName}
                  </h2>
                  <p className="text-xs text-cyan-400 font-mono">
                    {activeContact.lovId} • {activeContact.department} •{" "}
                    {activeContact.online ? "Active Now" : "Offline"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCallBanner(
                      `🎙️ Calling ${activeContact.displayName} (${activeContact.lovId})...`
                    );
                    setTimeout(() => setCallBanner(""), 3500);
                  }}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 transition cursor-pointer"
                  title="Start Voice Call"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCallBanner(
                      `📹 Starting Studio Video Session with ${activeContact.displayName}...`
                    );
                    setTimeout(() => setCallBanner(""), 3500);
                  }}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 transition cursor-pointer"
                  title="Start Video Call"
                >
                  <Video className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowInfoPanel((prev) => !prev)}
                  className={`p-2.5 rounded-xl border transition cursor-pointer ${
                    showInfoPanel
                      ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                      : "bg-slate-800 border-slate-700 text-slate-300"
                  }`}
                  title="Toggle Member Info"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>

            {callBanner && (
              <div className="px-6 py-2.5 bg-cyan-500/20 border-b border-cyan-500/30 text-xs font-semibold text-cyan-300 text-center">
                {callBanner}
              </div>
            )}

            {/* Messages Feed */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {(activeContact.messages || []).map((msg) => {
                const isMe = msg.sender === "me";
                return (
                  <div
                    key={msg.id}
                    className={`group flex flex-col ${
                      isMe ? "items-end" : "items-start"
                    }`}
                  >
                    <div className="relative max-w-md">
                      {/* Hover Reaction Picker */}
                      <div
                        className={`opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 ${
                          isMe ? "right-0" : "left-0"
                        } z-20 flex items-center gap-1 px-2 py-1 rounded-full bg-slate-900 border border-slate-700 shadow-xl`}
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
                            className="hover:scale-125 transition text-sm px-0.5 cursor-pointer"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>

                      <div
                        className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          isMe
                            ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-semibold rounded-br-xs shadow-lg shadow-cyan-500/15"
                            : "bg-slate-800 text-slate-100 border border-slate-700 rounded-bl-xs"
                        }`}
                      >
                        {msg.attachment?.type === "image" && (
                          <img
                            src={msg.attachment.url}
                            alt="attachment"
                            className="rounded-xl max-h-52 object-cover mb-2"
                          />
                        )}
                        <p>{msg.text}</p>
                      </div>

                      {msg.reaction && (
                        <span
                          className={`absolute -bottom-3 ${
                            isMe ? "left-2" : "right-2"
                          } px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-xs shadow`}
                        >
                          {msg.reaction}
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] text-slate-500 mt-1.5 px-1 flex items-center gap-1">
                      {msg.time}
                      {isMe && (
                        <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />
                      )}
                    </span>
                  </div>
                );
              })}

              {typingUser === activeContact.username && (
                <div className="flex items-center gap-2 text-xs text-cyan-400">
                  <div className="px-4 py-2.5 rounded-2xl bg-slate-800 border border-slate-700 inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:300ms]" />
                  </div>
                  <span className="text-slate-400">
                    {activeContact.displayName} is typing...
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Studio Quick Prompts */}
            <div className="px-6 py-2 bg-slate-900/60 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(activeContact.username, prompt)}
                  className="px-3 py-1 rounded-full bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-[11px] text-slate-300 whitespace-nowrap transition cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Message Input Bar */}
            <form
              onSubmit={handleSend}
              className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-3"
            >
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 transition cursor-pointer"
                title="Attach Image or Vocal Stem"
              >
                <ImageIcon className="w-5 h-5" />
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
                onClick={() => setInputText((prev) => prev + "🔥")}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 transition cursor-pointer"
                title="Insert Fire Emoji"
              >
                <Smile className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Write a message to ${activeContact.displayName} (${activeContact.lovId})...`}
                className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />

              {inputText.trim() ? (
                <button
                  type="submit"
                  className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm inline-flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => sendMessage(activeContact.username, "👍")}
                  className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-cyan-400 transition cursor-pointer"
                  title="Send Thumbs Up"
                >
                  <ThumbsUp className="w-5 h-5" />
                </button>
              )}
            </form>
          </div>
        )}

        {/* Right Column: Member Profile Info Panel */}
        {showInfoPanel && activeContact && (
          <div className="w-72 border-l border-slate-800 bg-slate-950/60 p-6 hidden xl:flex flex-col items-center text-center">
            <img
              src={activeContact.avatar}
              alt={activeContact.displayName}
              className="w-24 h-24 rounded-full object-cover border-4 border-cyan-400 shadow-xl bg-slate-900"
            />
            <h3 className="mt-4 text-lg font-bold text-white">
              {activeContact.fullName || activeContact.displayName}
            </h3>
            <p className="text-xs text-cyan-400 mt-0.5">{activeContact.role}</p>

            <span className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold">
              <Fingerprint className="w-3.5 h-3.5" />
              {activeContact.lovId || "LOV-MEMBER"}
            </span>

            <div className="w-full mt-6 pt-6 border-t border-slate-800 space-y-3 text-left text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Department</span>
                <span className="text-white font-semibold">
                  {activeContact.department}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <span className="text-emerald-400 font-semibold">
                  {activeContact.online ? "Active Now" : "Verified"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Username</span>
                <span className="text-cyan-400 font-mono">
                  @{activeContact.username}
                </span>
              </div>
            </div>

            <Link
              to={`/team/${activeContact.username}`}
              className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              View Full Member Profile
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
