import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { Author } from "../backend.d";
import type { GeminiMessage, UserProfile } from "../backend.d";
import { useAiChat } from "../hooks/useQueries";

export default function ChatMentor({ profile }: { profile: UserProfile }) {
  const [messages, setMessages] = useState<GeminiMessage[]>([
    {
      role: Author.ai,
      content: `Hi! I'm your AI mentor. How can I help with your ${profile.focusArea} goals today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const { mutateAsync: sendChat, isPending } = useAiChat();

  const scrollToBottom = () => {
    setTimeout(
      () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      50,
    );
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isPending) return;
    const userMsg: GeminiMessage = { role: Author.user, content: text };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    scrollToBottom();
    try {
      const reply = await sendChat({ messages: newMsgs, profile });
      setMessages((prev) => [...prev, { role: Author.ai, content: reply }]);
      scrollToBottom();
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: Author.ai,
          content: "I'm having trouble connecting right now. Please try again.",
        },
      ]);
      scrollToBottom();
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div
        className="flex-1 overflow-y-auto p-4 space-y-3"
        data-ocid="chat.panel"
      >
        {messages.map((m, i) => (
          <motion.div
            // biome-ignore lint/suspicious/noArrayIndexKey: chat messages use stable positional index
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex ${m.role === Author.user ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                m.role === Author.user
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-card border border-border text-foreground rounded-bl-sm"
              }`}
            >
              {m.content}
            </div>
          </motion.div>
        ))}
        {isPending && (
          <div className="flex justify-start" data-ocid="chat.loading_state">
            <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1 items-center">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-card border-t border-border flex gap-2">
        <Input
          data-ocid="chat.input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask for advice…"
          className="rounded-full bg-muted border-0 flex-1"
        />
        <Button
          data-ocid="chat.submit_button"
          size="icon"
          onClick={handleSend}
          disabled={isPending || !input.trim()}
          className="rounded-full shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
