import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, MessageCircle, SmilePlus, Target } from "lucide-react";
import { motion } from "motion/react";
import type { UserProfile } from "../backend.d";
import {
  useDailyMotivation,
  useGoals,
  useJournalEntries,
  useMoodLogs,
} from "../hooks/useQueries";

type Tab = "home" | "mentor" | "goals" | "mood" | "journal";

export default function Dashboard({
  profile,
  onNavigate,
}: { profile: UserProfile; onNavigate: (tab: Tab) => void }) {
  const { data: motivation, isLoading: motLoading } = useDailyMotivation();
  const { data: goals } = useGoals();
  const { data: moodLogs } = useMoodLogs();
  const { data: entries } = useJournalEntries();

  const completedGoals = goals?.filter((g) => g.completed).length ?? 0;
  const totalGoals = goals?.length ?? 0;
  const todayMood =
    moodLogs && moodLogs.length > 0 ? moodLogs[moodLogs.length - 1].mood : null;
  const journalCount = entries?.length ?? 0;

  const QUICK_ACTIONS: { id: Tab; icon: React.ReactNode; label: string }[] = [
    {
      id: "mentor",
      icon: <MessageCircle className="w-5 h-5" />,
      label: "Chat with Mentor",
    },
    { id: "goals", icon: <Target className="w-5 h-5" />, label: "View Goals" },
    { id: "mood", icon: <SmilePlus className="w-5 h-5" />, label: "Log Mood" },
    {
      id: "journal",
      icon: <BookOpen className="w-5 h-5" />,
      label: "Open Journal",
    },
  ];

  return (
    <div className="p-5 space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-xl font-bold text-foreground">Hello there! 👋</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Focusing on{" "}
          <span className="font-medium text-primary">{profile.focusArea}</span>{" "}
          today.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-3xl p-5 text-white"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.44 0.18 270), oklch(0.55 0.2 285), oklch(0.6 0.18 300))",
        }}
      >
        <div className="bg-white/20 w-max px-3 py-1 rounded-full text-xs font-semibold uppercase mb-3">
          ✨ Daily Spark
        </div>
        {motLoading ? (
          <Skeleton
            className="h-12 bg-white/20 rounded-xl"
            data-ocid="dashboard.motivation.loading_state"
          />
        ) : (
          <p
            className="text-sm font-medium leading-relaxed"
            data-ocid="dashboard.motivation.card"
          >
            {motivation}
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="grid grid-cols-3 gap-3"
      >
        <StatCard
          label="Goals"
          value={`${completedGoals}/${totalGoals}`}
          emoji="🎯"
        />
        <StatCard label="Today's Mood" value={todayMood ?? "—"} emoji="😊" />
        <StatCard label="Journal" value={String(journalCount)} emoji="📓" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_ACTIONS.map((a) => (
            <button
              type="button"
              key={a.id}
              data-ocid={`dashboard.${a.id}_button`}
              onClick={() => onNavigate(a.id)}
              className="flex items-center gap-3 p-4 bg-card rounded-2xl border border-border hover:border-primary/40 hover:shadow-card transition-all text-left"
            >
              <span className="text-primary">{a.icon}</span>
              <span className="text-sm font-medium text-foreground">
                {a.label}
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({
  label,
  value,
  emoji,
}: { label: string; value: string; emoji: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-3 text-center">
      <div className="text-xl mb-1">{emoji}</div>
      <div className="text-sm font-bold text-foreground">{value}</div>
      <div className="text-[10px] text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}
