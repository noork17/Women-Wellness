import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Send,
  Bot,
  User,
  Paperclip,
  Image,
  Mic,
  MicOff,
  Phone,
  Video,
  MoreVertical,
  Search,
  ArrowLeft,
  Heart,
  CheckCheck,
  Sparkles,
  MessageSquare,
  Plus,
  Settings,
  HelpCircle,
  Shield,
  Activity,
  FileText,
  Calendar,
  X,
  Volume2,
  VolumeX,
  Trash2,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { HEALTH_IMAGES } from "../assets/healthImages";

function getSpeechRecognition() {
  return typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition)
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;
}

const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) || "http://localhost:8080/auth";

/** Plain text for TTS from stored markdown-style content */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Minimal markdown-like formatting for bot messages (safe HTML) */
function formatMessageHtml(raw) {
  const escaped = escapeHtml(raw || "");
  return escaped
    .replace(/^### (.+)$/gm, '<span class="block text-sm font-semibold text-teal-200 mt-2 mb-0.5">$1</span>')
    .replace(/^## (.+)$/gm, '<span class="block text-base font-semibold text-white mt-3 mb-1">$1</span>')
    .replace(/^- (.+)$/gm, "• $1")
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\n/g, "<br/>");
}

function stripForSpeech(text) {
  if (!text) return "";
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\n+/g, ". ")
    .replace(/\s+/g, " ")
    .replace(/👋/g, "")
    .trim();
}

/** Best-effort BCP-47 tag for speech synthesis from message script */
function guessSpeechLang(text) {
  const t = stripForSpeech(text);
  if (!t) return "en-IN";
  if (/[\u0C00-\u0C7F]/.test(t)) return "te-IN";
  if (/[\u0900-\u097F]/.test(t)) return "hi-IN";
  if (/[\u0B80-\u0BFF]/.test(t)) return "ta-IN";
  if (/[\u0C80-\u0CFF]/.test(t)) return "kn-IN";
  if (/[\u0D00-\u0D7F]/.test(t)) return "ml-IN";
  if (/[\u0600-\u06FF]/.test(t)) return "ur-IN";
  return "en-IN";
}

function getOfflineFallbackResponse(userMessage) {
  const msg = userMessage.toLowerCase();

  if (
    msg.includes("report") ||
    msg.includes("lab") ||
    msg.includes("pdf") ||
    msg.includes("upload") ||
    msg.includes("test result") ||
    msg.includes("blood test")
  ) {
    return "**Report help (offline mode)** — Connect the backend and set `OPENAI_API_KEY` for full answers in your language.\n\n**When online:**\n• Ask detailed questions about lab or imaging reports in **any language** (Telugu, Hindi, English, etc.).\n• Or upload a **PDF** (paperclip) or **photo** (image button) — max ~12 MB.\n• You get: summary, key findings, what values might mean, limits, and when to see a doctor — **educational only**.\n• Scanned PDFs with no text work better as **clear photos** of each page.\n• Always confirm results with your clinician.\n\nHelpline: **+91 866 123 4567**";
  }
  if (msg.includes("breast cancer") || msg.includes("breast screening")) {
    return "Breast cancer screening is crucial for early detection. We recommend:\n\n• **Self-examination**: Monthly for all women 20+\n• **Clinical examination**: Every 1-3 years for ages 20-39\n• **Mammogram**: Annually for women 40+\n\nOur AI-powered screening can detect abnormalities with 94.3% accuracy. Would you like to schedule a screening?";
  }
  if (msg.includes("pcos") || msg.includes("polycystic")) {
    return "PCOS (Polycystic Ovary Syndrome) is a hormonal disorder. Common symptoms include:\n\n• Irregular periods\n• Excess androgen (acne, facial hair)\n• Polycystic ovaries on ultrasound\n• Weight gain\n• Hair thinning\n\nEarly detection and management can prevent complications. Our PCOS screening uses advanced ultrasound analysis.";
  }
  if (msg.includes("fibroid")) {
    return "Uterine fibroids are non-cancerous growths. Symptoms may include:\n\n• Heavy menstrual bleeding\n• Pelvic pain or pressure\n• Frequent urination\n• Difficulty emptying bladder\n\nMost fibroids don't need treatment, but monitoring is important. Our ultrasound screening can identify and track fibroid growth.";
  }
  if (msg.includes("appointment") || msg.includes("book") || msg.includes("schedule")) {
    return "I'd be happy to help you book an appointment! You can:\n\n1. **Online Booking**: Visit our dashboard to schedule\n2. **Call**: +91 866 123 4567\n3. **Walk-in**: Visit any SETV center\n\nWe have centers across all 13 districts of Andhra Pradesh. Would you like me to guide you to the booking page?";
  }
  if (msg.includes("sign") || msg.includes("symptom") || msg.includes("warning")) {
    return "Warning signs to watch for include:\n\n**Breast Cancer:**\n• Lump in breast or underarm\n• Skin changes or dimpling\n• Nipple discharge\n\n**PCOS:**\n• Irregular periods\n• Unexplained weight gain\n\n**Fibroids:**\n• Heavy bleeding\n• Pelvic pressure\n\nIf you notice any of these, please schedule a screening soon.";
  }
  if (msg.includes("cost") || msg.includes("price") || msg.includes("fee")) {
    return "Our screening services are subsidized by the government:\n\n• **Basic Screening**: ₹500\n• **Comprehensive Package**: ₹1,500\n• **AI-Enhanced Analysis**: Included free\n\n*Free screenings available at government-sponsored camps and for BPL card holders.*";
  }
  if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
    return "Hello! 👋 Welcome to SETV Health Assistant. I'm here to help you with:\n\n• Breast cancer screening information\n• PCOS detection and management\n• Fibroid screening queries\n• Appointment booking\n• General women's health questions\n\nWhat would you like to know?";
  }
  if (msg.includes("thank")) {
    return "You're welcome! Taking care of your health is important, and I'm glad I could help. Remember:\n\n• Regular screenings save lives\n• Early detection improves outcomes\n• We're here 24/7 for your questions\n\nIs there anything else you'd like to know?";
  }

  return "Thank you for your question. **AI chat is offline** — start the backend with `OPENAI_API_KEY` for answers in Telugu, Hindi, English, and more.\n\nFor now:\n1. Visit our FAQ\n2. Helpline: +91 866 123 4567\n\nTopics: breast screening, PCOS, fibroids.";
}

const CHAT_STORAGE_KEY = "setvChatSessions";

const defaultGreetingMessage = () => ({
  id: 1,
  type: "bot",
  content:
    "Hello! I'm your SETV Health Assistant.\n\n**Languages:** Type in **English**, **Telugu (తెలుగు)**, **Hindi (हिन्दी)**, or many other Indian languages — answers follow **your** language. Use the language menu below for **voice input** and **uploaded report** summaries.\n\n**Reports:** Ask anything about lab or imaging reports, or use the **paperclip** / **image** buttons to upload a PDF or photo for a detailed plain-language breakdown (not a diagnosis — always confirm with your doctor).\n\nHow can I help you today?",
  timestamp: new Date(Date.now() - 300000),
});

function makeSession(id, title, messages) {
  return {
    id,
    title,
    messages,
    updatedAt: Date.now(),
  };
}

function loadSessionsFromStorage() {
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data?.sessions?.length) return null;
    return data.sessions.map((s) => ({
      ...s,
      updatedAt: typeof s.updatedAt === "number" ? s.updatedAt : Date.now(),
      messages: (s.messages || []).map((m) => ({
        ...m,
        timestamp: m.timestamp ? new Date(m.timestamp) : new Date(),
      })),
    }));
  } catch {
    return null;
  }
}

function formatChatListDate(ts) {
  const d = new Date(ts);
  const now = new Date();
  const dayMs = 86400000;
  if (now - d < 60000) return "Now";
  if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const y = new Date(now - dayMs);
  if (d.toDateString() === y.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function titleFromFirstUserMessage(text) {
  const t = String(text || "").replace(/\*\*[^*]+\*\*/g, "").trim();
  if (!t) return "New chat";
  return t.length > 36 ? `${t.slice(0, 33)}…` : t;
}

const ChatPage = () => {
  const [chatSessions, setChatSessions] = useState(() => {
    const stored = typeof localStorage !== "undefined" ? loadSessionsFromStorage() : null;
    if (stored?.length) {
      return stored;
    }
    return [
      makeSession("current", "Current Chat", [defaultGreetingMessage()]),
      makeSession("chat1", "Breast Screening Query", [defaultGreetingMessage()]),
      makeSession("chat2", "PCOS Symptoms Discussion", [defaultGreetingMessage()]),
      makeSession("chat3", "Appointment Booking", [defaultGreetingMessage()]),
    ];
  });
  const [activeChatId, setActiveChatId] = useState(() => {
    try {
      const raw = localStorage.getItem(CHAT_STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data?.activeId && typeof data.activeId === "string") return data.activeId;
      }
    } catch {
      /* */
    }
    return "current";
  });
  const [chatSearch, setChatSearch] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isAnalyzingReport, setIsAnalyzingReport] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [assistantLocale, setAssistantLocale] = useState(() => {
    try {
      return localStorage.getItem("setvChatLocale") || "en";
    } catch {
      return "en";
    }
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const isRecordingRef = useRef(false);
  const preMicTextRef = useRef("");
  const voiceAccumRef = useRef("");
  const lastSpokenIdRef = useRef(null);
  const reportFileInputRef = useRef(null);
  const reportImageInputRef = useRef(null);
  const navigate = useNavigate();

  const messages = useMemo(() => {
    const s = chatSessions.find((x) => x.id === activeChatId);
    return s?.messages ?? [];
  }, [chatSessions, activeChatId]);

  const filteredSessions = useMemo(() => {
    const q = chatSearch.trim().toLowerCase();
    const sorted = [...chatSessions].sort((a, b) => b.updatedAt - a.updatedAt);
    if (!q) return sorted;
    return sorted.filter((s) => s.title.toLowerCase().includes(q));
  }, [chatSessions, chatSearch]);

  const updateActiveMessages = useCallback(
    (updater) => {
      setChatSessions((prev) =>
        prev.map((s) => {
          if (s.id !== activeChatId) return s;
          const newMessages = typeof updater === "function" ? updater(s.messages) : updater;
          const firstUser = newMessages.find((m) => m.type === "user");
          let nextTitle = s.title;
          if (firstUser && (s.title === "New chat" || s.title === "Current Chat")) {
            nextTitle = titleFromFirstUserMessage(firstUser.content);
          }
          return { ...s, messages: newMessages, updatedAt: Date.now(), title: nextTitle };
        })
      );
    },
    [activeChatId]
  );

  useEffect(() => {
    try {
      const payload = {
        activeId: activeChatId,
        sessions: chatSessions.map((s) => ({
          ...s,
          messages: s.messages.map((m) => ({
            ...m,
            timestamp: m.timestamp instanceof Date ? m.timestamp.toISOString() : m.timestamp,
          })),
        })),
      };
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* */
    }
  }, [chatSessions, activeChatId]);

  useEffect(() => {
    if (chatSessions.length === 0) {
      const nid = `c-${Date.now()}`;
      setChatSessions([makeSession(nid, "New chat", [defaultGreetingMessage()])]);
      setActiveChatId(nid);
      return;
    }
    if (!chatSessions.some((s) => s.id === activeChatId)) {
      setActiveChatId(chatSessions[0].id);
    }
  }, [chatSessions, activeChatId]);

  useEffect(() => {
    lastSpokenIdRef.current = null;
  }, [activeChatId]);

  const handleNewChat = useCallback(() => {
    lastSpokenIdRef.current = null;
    const id = `c-${Date.now()}`;
    setChatSessions((prev) => [makeSession(id, "New chat", [defaultGreetingMessage()]), ...prev]);
    setActiveChatId(id);
    setInputMessage("");
    toast.success("Started a new chat");
  }, []);

  const handleDeleteChat = useCallback((e, id) => {
    e.stopPropagation();
    lastSpokenIdRef.current = null;
    setChatSessions((prev) => prev.filter((s) => s.id !== id));
    toast.success("Chat removed");
  }, []);

  useEffect(() => {
    setVoiceSupported(!!getSpeechRecognition());
  }, []);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  useEffect(() => {
    try {
      localStorage.setItem("setvChatLocale", assistantLocale);
    } catch {
      /* */
    }
  }, [assistantLocale]);

  const speechRecognitionLang = assistantLocale === "te" ? "te-IN" : assistantLocale === "hi" ? "hi-IN" : "en-IN";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /** Read new assistant messages aloud when voice output is on (skip initial greeting) */
  useEffect(() => {
    if (!soundEnabled || typeof window === "undefined" || !window.speechSynthesis) return;
    const last = messages[messages.length - 1];
    if (!last || last.type !== "bot") return;
    if (last.id === 1) return;
    if (lastSpokenIdRef.current === last.id) return;
    lastSpokenIdRef.current = last.id;

    window.speechSynthesis.cancel();
    const text = stripForSpeech(last.content);
    if (!text) return;

    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.95;
    utter.pitch = 1;
    utter.lang = guessSpeechLang(last.content);
    utter.onerror = () => {};
    window.speechSynthesis.speak(utter);
  }, [messages, soundEnabled]);

  useEffect(() => {
    if (!soundEnabled && typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, [soundEnabled]);

  /** Start/stop browser speech recognition */
  useEffect(() => {
    if (!isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          /* already stopped */
        }
        recognitionRef.current = null;
      }
      return;
    }

    const SR = getSpeechRecognition();
    if (!SR) {
      toast.error("Voice input needs Chrome, Edge, or Safari.");
      setIsRecording(false);
      return;
    }

    preMicTextRef.current = inputMessage;
    voiceAccumRef.current = "";

    const recognition = new SR();
    recognition.lang = speechRecognitionLang;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const piece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          voiceAccumRef.current += piece;
        } else {
          interim += piece;
        }
      }
      const combined = (voiceAccumRef.current + interim).trim();
      const prefix = preMicTextRef.current;
      setInputMessage(combined ? `${prefix}${prefix && !prefix.endsWith(" ") ? " " : ""}${combined}` : prefix);
    };

    recognition.onerror = (e) => {
      if (e.error === "not-allowed") {
        toast.error("Microphone permission denied. Allow mic in the browser address bar.");
      } else if (e.error !== "no-speech" && e.error !== "aborted") {
        toast.error(`Voice: ${e.error}`);
      }
      setIsRecording(false);
    };

    recognition.onend = () => {
      if (isRecordingRef.current) {
        try {
          recognition.start();
        } catch {
          setIsRecording(false);
        }
      }
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
      toast.success("Listening… speak now. Tap mic again to stop.", { duration: 2500 });
    } catch {
      toast.error("Could not start microphone.");
      setIsRecording(false);
    }

    return () => {
      try {
        recognition.stop();
      } catch {
        /* */
      }
      recognitionRef.current = null;
    };
  }, [isRecording, speechRecognitionLang]);

  const quickActions = [
    { icon: Calendar, label: "Book Appointment", color: "from-violet-500 to-purple-600", href: "/book-appointment" },
    { icon: FileText, label: "View Reports", color: "from-emerald-500 to-teal-600", href: "/all-reports" },
    { icon: Activity, label: "Screening Status", color: "from-rose-500 to-pink-600", href: "/dashboard" },
    { icon: HelpCircle, label: "FAQ", color: "from-amber-500 to-orange-600", href: "/faq" },
  ];

  const suggestedQuestions = [
    "What are the early signs of breast cancer?",
    "How do I read my lab report? What can you explain?",
    "How often should I get screened?",
    "What is PCOS and its symptoms?",
    "నా ల్యాబ్ రిపోర్ట్‌ను ఎలా అర్థం చేసుకోవాలి?",
    "मेरी लैब रिपोर्ट के बारे में विस्तार से बताएं",
    "Are fibroids dangerous?",
    "How can I book an appointment?",
  ];

  const handleReportFileChange = useCallback(async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || isTyping || isAnalyzingReport) return;

    const uid = Date.now();
    updateActiveMessages((prev) => [
      ...prev,
      {
        id: uid,
        type: "user",
        content: `📎 **Uploaded report:** ${file.name}`,
        timestamp: new Date(),
      },
    ]);
    setIsAnalyzingReport(true);
    setIsTyping(true);

    try {
      const fd = new FormData();
      fd.append("report", file);
      fd.append("language", assistantLocale);
      const res = await fetch(`${API_BASE}/api/analyze-report`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      updateActiveMessages((prev) => [
        ...prev,
        {
          id: uid + 1,
          type: "bot",
          content: data.analysis,
          timestamp: new Date(),
        },
      ]);
      toast.success("Report analyzed");
    } catch (err) {
      const message = err?.message || "Could not analyze report";
      toast.error(message);
      updateActiveMessages((prev) => [
        ...prev,
        {
          id: uid + 1,
          type: "bot",
          content: `I couldn't analyze that file: **${message}**\n\nTry a clear **PDF** or **photo** (PNG/JPEG/WebP) under **12 MB**. Scanned PDFs often work better as photos of each page.`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsAnalyzingReport(false);
      setIsTyping(false);
    }
  }, [isTyping, isAnalyzingReport, assistantLocale, updateActiveMessages]);

  const handleSend = useCallback(async () => {
    const text = inputMessage.trim();
    if (!text || isTyping || isAnalyzingReport) return;

    const uid = Date.now();
    updateActiveMessages((prev) => [...prev, { id: uid, type: "user", content: text, timestamp: new Date() }]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat-assistant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      const reply = data.reply;
      if (!reply || typeof reply !== "string") {
        throw new Error("No reply from assistant.");
      }
      updateActiveMessages((prev) => [...prev, { id: uid + 1, type: "bot", content: reply, timestamp: new Date() }]);
    } catch (err) {
      const offline = String(err?.message || "").toLowerCase().includes("failed to fetch");
      if (offline) {
        toast.error("Could not reach the server — showing basic offline answers.");
      } else {
        toast.error(err?.message || "Chat failed");
      }
      updateActiveMessages((prev) => [
        ...prev,
        {
          id: uid + 1,
          type: "bot",
          content: getOfflineFallbackResponse(text),
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [inputMessage, isTyping, isAnalyzingReport, updateActiveMessages]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    inputRef.current?.focus();
  };

  const speakMessage = useCallback((msg) => {
    if (!soundEnabled) {
      toast("Turn on the speaker icon to hear replies");
      return;
    }
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const text = stripForSpeech(msg.content);
    if (!text) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.95;
    utter.lang = guessSpeechLang(msg.content);
    utter.onerror = () => {};
    window.speechSynthesis.speak(utter);
  }, [soundEnabled]);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  const toggleMic = () => {
    if (!voiceSupported) {
      toast.error("Voice input is not supported in this browser. Try Chrome or Edge.");
      return;
    }
    setIsRecording((r) => !r);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Toaster position="top-center" />

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-cover bg-center opacity-5" style={{ backgroundImage: `url(${HEALTH_IMAGES.darkTech})` }} />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="relative z-20 w-80 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800 flex flex-col"
          >
            <div className="p-4 border-b border-slate-800">
              <Link to="/landing" className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
                  <Heart className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="font-bold text-white">SETV Health</h1>
                  <p className="text-xs text-slate-500">AI Chat Assistant</p>
                </div>
              </Link>

              <button
                type="button"
                onClick={handleNewChat}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 font-semibold text-sm hover:shadow-lg hover:shadow-teal-500/20 transition-all"
              >
                <Plus size={18} />
                New Chat
              </button>
            </div>

            <div className="p-4">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={chatSearch}
                  onChange={(e) => setChatSearch(e.target.value)}
                  placeholder="Search chats..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-sm focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2">
              <p className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Recent Chats</p>
              {filteredSessions.length === 0 ? (
                <p className="px-3 py-2 text-xs text-slate-500">No chats match your search.</p>
              ) : (
                filteredSessions.map((chat) => (
                  <div
                    key={chat.id}
                    className={`w-full flex items-center gap-1 mb-1 rounded-xl ${
                      activeChatId === chat.id ? "bg-teal-500/10 border border-teal-500/30" : "hover:bg-slate-800/50 border border-transparent"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveChatId(chat.id)}
                      className="flex-1 flex items-center gap-3 px-3 py-3 rounded-xl text-left min-w-0 transition-all"
                    >
                      <div
                        className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${
                          activeChatId === chat.id ? "bg-teal-500/20" : "bg-slate-800"
                        }`}
                      >
                        <MessageSquare size={18} className={activeChatId === chat.id ? "text-teal-400" : "text-slate-500"} />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className={`text-sm font-medium truncate ${activeChatId === chat.id ? "text-teal-400" : "text-slate-300"}`}>
                          {chat.title}
                        </p>
                        <p className="text-xs text-slate-500">{formatChatListDate(chat.updatedAt)}</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      title="Delete chat"
                      onClick={(e) => handleDeleteChat(e, chat.id)}
                      className="shrink-0 p-2 mr-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800/80 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-slate-800 space-y-2">
              <Link
                to="/dashboard"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/50 transition-colors text-slate-400 hover:text-white"
              >
                <Activity size={18} />
                <span className="text-sm">Dashboard</span>
              </Link>
              <Link
                to="/faq"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/50 transition-colors text-slate-400 hover:text-white"
              >
                <HelpCircle size={18} />
                <span className="text-sm">Help & FAQ</span>
              </Link>
              <button
                type="button"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/50 transition-colors text-slate-400 hover:text-white"
              >
                <Settings size={18} />
                <span className="text-sm">Settings</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex-1 relative z-10 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 px-4 sm:px-6 py-4 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-xl hover:bg-slate-800 transition-colors lg:hidden shrink-0"
              >
                {isSidebarOpen ? <X size={20} /> : <MessageSquare size={20} />}
              </button>
              <button type="button" onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-slate-800 transition-colors shrink-0">
                <ArrowLeft size={20} className="text-slate-400" />
              </button>
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
                    <Bot size={22} className="text-white sm:w-6 sm:h-6" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-bold text-white text-sm sm:text-base truncate">SETV Health Assistant</h2>
                  <p className="text-[10px] sm:text-xs text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shrink-0" />
                    <span className="truncate">Online • Voice + reports</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <button
                type="button"
                title={soundEnabled ? "Mute AI voice (replies won't be read aloud)" : "Enable AI voice for replies"}
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 sm:p-2.5 rounded-xl hover:bg-slate-800 transition-colors ${
                  soundEnabled ? "text-teal-400" : "text-slate-400"
                }`}
              >
                {soundEnabled ? <Volume2 size={18} className="sm:w-5 sm:h-5" /> : <VolumeX size={18} className="sm:w-5 sm:h-5" />}
              </button>
              <button
                type="button"
                title="For a phone appointment, use Book Appointment or the helpline in chat"
                onClick={() => toast("Use **Book Appointment** or call the helpline from assistant replies for a real phone consult.")}
                className="p-2 sm:p-2.5 rounded-xl hover:bg-slate-800 transition-colors text-slate-400 hidden sm:block"
              >
                <Phone size={20} />
              </button>
              <button
                type="button"
                title="Video consults are scheduled through your doctor — not in this demo chat"
                onClick={() => toast("Video visits are arranged with your care team after you book.")}
                className="p-2 sm:p-2.5 rounded-xl hover:bg-slate-800 transition-colors text-slate-400 hidden sm:block"
              >
                <Video size={20} />
              </button>
              <button type="button" className="p-2 sm:p-2.5 rounded-xl hover:bg-slate-800 transition-colors text-slate-400">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {quickActions.map((action, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={action.href}
                  className="block p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/80 transition-all group"
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}
                  >
                    <action.icon size={20} className="text-white" />
                  </div>
                  <p className="text-sm font-medium text-slate-300">{action.label}</p>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-3 max-w-[85%] sm:max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : ""}`}>
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                      message.type === "user"
                        ? "bg-gradient-to-br from-violet-500 to-purple-600"
                        : "bg-gradient-to-br from-teal-400 to-emerald-500"
                    }`}
                  >
                    {message.type === "user" ? <User size={18} className="text-white" /> : <Bot size={18} className="text-white" />}
                  </div>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.type === "user"
                        ? "bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/30"
                        : "bg-slate-800/50 border border-slate-700"
                    }`}
                  >
                    <p
                      className="text-sm text-slate-200 whitespace-pre-line"
                      dangerouslySetInnerHTML={{ __html: formatMessageHtml(message.content) }}
                    />
                    <div className={`flex items-center gap-2 mt-2 flex-wrap ${message.type === "user" ? "justify-end" : "justify-between"}`}>
                      <span className="text-[10px] text-slate-500">{formatTime(message.timestamp)}</span>
                      <div className="flex items-center gap-2">
                        {message.type === "user" && <CheckCheck size={14} className="text-teal-400" />}
                        {message.type === "bot" && (
                          <button
                            type="button"
                            onClick={() => speakMessage(message)}
                            className="p-1 rounded-lg hover:bg-slate-700/80 text-slate-500 hover:text-teal-400 transition-colors"
                            title="Read this message aloud"
                          >
                            <Volume2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            <AnimatePresence>
              {(isTyping || isAnalyzingReport) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
                    <Bot size={18} className="text-white" />
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-2xl px-4 py-3">
                    <p className="text-xs text-slate-400 mb-2">
                      {isAnalyzingReport ? "Reading your report…" : "Assistant is thinking…"}
                    </p>
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>

          {messages.length < 4 && (
            <div className="mt-6">
              <p className="text-xs text-slate-500 mb-3 flex items-center gap-2">
                <Sparkles size={14} />
                Suggested questions
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleQuickQuestion(question)}
                    className="px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-sm text-slate-400 hover:bg-slate-800 hover:text-white hover:border-teal-500/50 transition-all"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 px-4 sm:px-6 py-4 bg-slate-900/80 backdrop-blur-xl border-t border-slate-800">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-3 text-[11px] text-slate-500">
            <span className="shrink-0">Mic & uploaded report language:</span>
            <select
              value={assistantLocale}
              onChange={(e) => setAssistantLocale(e.target.value)}
              className="rounded-lg bg-slate-800 border border-slate-600 text-slate-200 text-xs py-1.5 px-2 max-w-[220px]"
              aria-label="Language for voice input and report file analysis"
            >
              <option value="en">English</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="hi">हिन्दी (Hindi)</option>
            </select>
            <span className="hidden md:inline text-slate-600">Typed chat auto-matches your language.</span>
          </div>
          {isRecording && (
            <p className="text-center text-xs text-red-400 mb-2 animate-pulse">Listening… tap the mic again to stop</p>
          )}
          {!voiceSupported && (
            <p className="text-center text-[10px] text-slate-600 mb-2">Voice typing works in Chrome, Edge, or Safari (HTTPS or localhost).</p>
          )}
          <div className="flex items-end gap-2 sm:gap-3">
            <div className="flex gap-1 sm:gap-2">
              <input
                ref={reportFileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.webp,application/pdf"
                onChange={handleReportFileChange}
              />
              <input
                ref={reportImageInputRef}
                type="file"
                className="hidden"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleReportFileChange}
              />
              <button
                type="button"
                disabled={isTyping || isAnalyzingReport}
                onClick={() => reportFileInputRef.current?.click()}
                className="p-2 sm:p-3 rounded-xl hover:bg-slate-800 transition-colors text-slate-400 disabled:opacity-40"
                title="Upload lab or imaging report (PDF or image)"
              >
                <Paperclip size={20} />
              </button>
              <button
                type="button"
                disabled={isTyping || isAnalyzingReport}
                onClick={() => reportImageInputRef.current?.click()}
                className="p-2 sm:p-3 rounded-xl hover:bg-slate-800 transition-colors text-slate-400 disabled:opacity-40"
                title="Upload report as photo (PNG, JPEG)"
              >
                <Image size={20} />
              </button>
            </div>

            <div className="flex-1 relative min-w-0">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isRecording ? "Speaking…" : "Type in any language, or use mic…"}
                rows={1}
                className="w-full px-4 py-3 pr-12 rounded-2xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none resize-none text-sm placeholder-slate-500 transition-colors text-white"
                style={{ maxHeight: "120px" }}
              />
              <button
                type="button"
                title={voiceSupported ? (isRecording ? "Stop listening" : "Speak your question") : "Voice not available"}
                onClick={toggleMic}
                disabled={!voiceSupported}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
                  isRecording ? "bg-red-500 text-white" : "hover:bg-slate-700 text-slate-400 disabled:opacity-40"
                }`}
              >
                {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
            </div>

            <button
              type="button"
              onClick={handleSend}
              disabled={!inputMessage.trim() || isTyping || isAnalyzingReport}
              className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-teal-500/25 transition-all shrink-0"
            >
              <Send size={20} />
            </button>
          </div>

          <div className="flex items-center justify-center mt-3 gap-2 text-xs text-slate-600 flex-wrap">
            <Shield size={12} className="shrink-0" />
            <span>
              Not a substitute for your doctor • Upload reports via clip or image • Speaker for AI voice • Mic: browser (en-IN)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
