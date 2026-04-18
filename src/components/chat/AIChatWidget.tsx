"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ENDPOINTS } from "@/services/endpoints";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_CHIPS = [
  "What is EulerX?",
  "How do I connect Bybit?",
  "What plans are available?",
  "Is my money safe?",
  "How do signals work?",
];

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg: Message = { role: "user", content: trimmed };
      const next = [...messages, userMsg];
      setMessages(next);
      setInput("");
      setLoading(true);

      try {
        const res = await fetch(ENDPOINTS.CHAT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: next }),
        });

        if (!res.ok) throw new Error("Service unavailable");

        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "I'm temporarily unavailable. Please try again or email support@eulerx.io.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [messages, loading]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`fixed bottom-5 left-5 z-[9999] flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-200 ${
          open
            ? "bg-white/10 backdrop-blur-md rotate-45"
            : "bg-neon hover:bg-neon/90"
        }`}
        aria-label={open ? "Close chat" : "Open AI support chat"}
      >
        {open ? (
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
        ) : (
          <svg
            className="h-6 w-6 text-dark-100"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 left-5 z-[9999] flex h-[520px] w-[380px] flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-dark-200 shadow-2xl sm:w-[400px]">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-white/[0.06] bg-dark-300 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neon/20">
              <span className="text-xs font-bold text-neon">AI</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">
                EulerX Support
              </p>
              <p className="text-[10px] text-gray-400">
                AI-powered assistant
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded p-1 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
            {messages.length === 0 && (
              <div className="space-y-4 pt-4">
                <div className="rounded-xl bg-dark-300/70 p-4">
                  <p className="text-sm font-medium text-white">
                    Welcome to EulerX Support
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Ask me anything about the platform, plans, connecting your
                    exchange, signals, security, or the ambassador programme.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {QUICK_CHIPS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="rounded-full border border-white/[0.08] bg-dark-300/50 px-3 py-1.5 text-[11px] text-gray-300 transition-colors hover:border-neon/30 hover:text-neon"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    m.role === "user"
                      ? "bg-neon/20 text-white"
                      : "bg-dark-300/70 text-gray-200"
                  }`}
                >
                  {m.content.split("\n").map((line, j) => (
                    <span key={j}>
                      {line}
                      {j < m.content.split("\n").length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl bg-dark-300/70 px-4 py-3">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neon/60 [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neon/60 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neon/60 [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-white/[0.06] bg-dark-300 p-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about EulerX..."
                rows={1}
                className="flex-1 resize-none rounded-xl border border-white/[0.06] bg-dark-200 px-3 py-2.5 text-[13px] text-white placeholder-gray-500 outline-none transition-colors focus:border-neon/30"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neon transition-opacity disabled:opacity-30"
              >
                <svg
                  className="h-4 w-4 text-dark-100"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12h14M12 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
            <p className="mt-1.5 text-center text-[9px] text-gray-500">
              AI responses may not always be accurate. For critical issues,
              contact support@eulerx.io
            </p>
          </div>
        </div>
      )}
    </>
  );
}
