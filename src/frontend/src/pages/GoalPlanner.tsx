import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Circle, Loader2, Plus, Target } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useAddGoal, useGoals, useToggleGoal } from "../hooks/useQueries";

export default function GoalPlanner() {
  const [input, setInput] = useState("");
  const { data: goals, isLoading } = useGoals();
  const { mutateAsync: addGoal, isPending: adding } = useAddGoal();
  const { mutateAsync: toggleGoal, isPending: toggling } = useToggleGoal();

  const completedCount = goals?.filter((g) => g.completed).length ?? 0;
  const totalCount = goals?.length ?? 0;

  const handleAdd = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    try {
      await addGoal(text);
      toast.success("Goal added!");
    } catch {
      toast.error("Failed to add goal.");
      setInput(text);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") void handleAdd();
  };

  return (
    <div className="p-5">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-foreground">🎯 Goal Planner</h2>
        {totalCount > 0 && (
          <p className="text-sm text-muted-foreground mt-0.5">
            {completedCount} of {totalCount} goals completed
          </p>
        )}
      </div>

      {totalCount > 0 && (
        <div className="mb-5 bg-border rounded-full h-2">
          <div
            className="h-2 rounded-full bg-primary transition-all"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
      )}

      <div className="flex gap-2 mb-6">
        <Input
          data-ocid="goals.input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Add a new goal…"
          className="rounded-xl"
        />
        <Button
          data-ocid="goals.add_button"
          onClick={handleAdd}
          disabled={adding || !input.trim()}
          className="rounded-xl px-4 shrink-0"
        >
          {adding ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3" data-ocid="goals.loading_state">
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} className="h-14 rounded-2xl" />
          ))}
        </div>
      ) : !goals?.length ? (
        <div
          className="text-center py-16 text-muted-foreground"
          data-ocid="goals.empty_state"
        >
          <Target className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No goals yet. Add your first one above!</p>
        </div>
      ) : (
        <AnimatePresence>
          <div className="space-y-3" data-ocid="goals.list">
            {goals.map((g, i) => (
              <motion.div
                // biome-ignore lint/suspicious/noArrayIndexKey: goals use stable positional index
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.05 }}
                data-ocid={`goals.item.${i + 1}`}
                onClick={() => {
                  if (!toggling) void toggleGoal(i);
                }}
                className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  g.completed
                    ? "bg-muted border-border opacity-60"
                    : "bg-card border-border hover:border-primary/40 hover:shadow-card"
                }`}
              >
                {g.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                )}
                <span
                  className={`text-sm font-medium ${g.completed ? "line-through text-muted-foreground" : "text-foreground"}`}
                >
                  {g.description}
                </span>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
