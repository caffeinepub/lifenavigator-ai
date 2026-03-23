import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useAddMood, useMoodLogs } from "../hooks/useQueries";

const MOODS = [
  { emoji: "😊", label: "Happy", value: "Happy" },
  { emoji: "💪", label: "Motivated", value: "Motivated" },
  { emoji: "😐", label: "Neutral", value: "Neutral" },
  { emoji: "😰", label: "Stressed", value: "Stressed" },
  { emoji: "😴", label: "Tired", value: "Tired" },
];

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState("");
  const [note, setNote] = useState("");
  const { data: moodLogs, isLoading } = useMoodLogs();
  const { mutateAsync: addMood, isPending } = useAddMood();

  const latestMood =
    moodLogs && moodLogs.length > 0 ? moodLogs[moodLogs.length - 1] : null;

  const handleLog = async () => {
    if (!selectedMood) return;
    try {
      await addMood({ mood: selectedMood, note });
      toast.success("Mood logged!");
      setSelectedMood("");
      setNote("");
    } catch {
      toast.error("Failed to log mood.");
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold text-foreground mb-1">
        😊 Mood Tracker
      </h2>
      <p className="text-sm text-muted-foreground mb-5">
        How are you feeling today?
      </p>

      {latestMood && (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 mb-5">
          <p className="text-xs text-muted-foreground mb-1">
            Latest logged mood
          </p>
          <p className="text-sm font-semibold text-foreground">
            {MOODS.find((m) => m.value === latestMood.mood)?.emoji ?? ""}{" "}
            {latestMood.mood}
            {latestMood.note && (
              <span className="font-normal text-muted-foreground">
                {" "}
                — {latestMood.note}
              </span>
            )}
          </p>
        </div>
      )}

      <div className="flex gap-2 flex-wrap mb-5" data-ocid="mood.buttons.panel">
        {MOODS.map((m) => (
          <button
            type="button"
            key={m.value}
            data-ocid={`mood.${m.value.toLowerCase()}_button`}
            onClick={() => setSelectedMood(m.value)}
            className={`flex flex-col items-center gap-1 px-4 py-3 rounded-2xl border-2 transition-all ${
              selectedMood === m.value
                ? "border-primary bg-primary/10"
                : "border-border bg-card hover:border-primary/40"
            }`}
          >
            <span className="text-2xl">{m.emoji}</span>
            <span className="text-xs font-medium text-foreground">
              {m.label}
            </span>
          </button>
        ))}
      </div>

      <Textarea
        data-ocid="mood.note_textarea"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a note (optional)…"
        className="rounded-2xl mb-4 text-sm resize-none"
        rows={3}
      />

      <Button
        data-ocid="mood.submit_button"
        onClick={handleLog}
        disabled={!selectedMood || isPending}
        className="w-full rounded-xl"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        {isPending ? "Logging…" : "Log Mood"}
      </Button>

      {isLoading ? (
        <div className="mt-6 space-y-2" data-ocid="mood.loading_state">
          <Skeleton className="h-12 rounded-2xl" />
          <Skeleton className="h-12 rounded-2xl" />
        </div>
      ) : (
        moodLogs &&
        moodLogs.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Recent History
            </h3>
            <div className="space-y-2" data-ocid="mood.history.list">
              {[...moodLogs]
                .reverse()
                .slice(0, 7)
                .map((entry, i) => (
                  <motion.div
                    // biome-ignore lint/suspicious/noArrayIndexKey: mood log history uses stable positional index
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    data-ocid={`mood.history.item.${i + 1}`}
                    className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl"
                  >
                    <span className="text-xl">
                      {MOODS.find((m) => m.value === entry.mood)?.emoji ?? "😶"}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {entry.mood}
                      </p>
                      {entry.note && (
                        <p className="text-xs text-muted-foreground">
                          {entry.note}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}
