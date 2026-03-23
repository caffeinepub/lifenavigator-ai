import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Loader2, Plus, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useAddJournalEntry, useJournalEntries } from "../hooks/useQueries";

export default function Journal() {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { data: entries, isLoading } = useJournalEntries();
  const { mutateAsync: addEntry, isPending } = useAddJournalEntry();

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in both title and content.");
      return;
    }
    try {
      await addEntry({ title: title.trim(), content: content.trim() });
      toast.success("Entry saved!");
      setTitle("");
      setContent("");
      setIsCreating(false);
    } catch {
      toast.error("Failed to save entry.");
    }
  };

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-foreground">📓 Journal</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {entries?.length ?? 0} entries
          </p>
        </div>
        <Button
          data-ocid="journal.new_entry_button"
          size="sm"
          onClick={() => setIsCreating(true)}
          className="rounded-xl"
        >
          <Plus className="w-4 h-4 mr-1" /> New Entry
        </Button>
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="bg-card border border-border rounded-2xl p-4 mb-5"
            data-ocid="journal.new_entry_panel"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground text-sm">
                New Entry
              </h3>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                data-ocid="journal.close_button"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <Input
              data-ocid="journal.title_input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Entry title…"
              className="rounded-xl mb-3 text-sm"
            />
            <Textarea
              data-ocid="journal.content_textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts…"
              className="rounded-xl text-sm resize-none mb-3"
              rows={5}
            />
            <Button
              data-ocid="journal.save_button"
              onClick={handleSave}
              disabled={isPending || !title.trim() || !content.trim()}
              className="w-full rounded-xl"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {isPending ? "Saving…" : "Save Entry"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="space-y-3" data-ocid="journal.loading_state">
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} className="h-20 rounded-2xl" />
          ))}
        </div>
      ) : !entries?.length ? (
        <div
          className="text-center py-16 text-muted-foreground"
          data-ocid="journal.empty_state"
        >
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">
            No entries yet. Start writing your first one!
          </p>
        </div>
      ) : (
        <div className="space-y-3" data-ocid="journal.list">
          {[...entries].reverse().map((entry, i) => (
            <motion.div
              // biome-ignore lint/suspicious/noArrayIndexKey: journal entries use stable positional index
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.05 }}
              data-ocid={`journal.item.${i + 1}`}
              className="bg-card border border-border rounded-2xl p-4 hover:shadow-card transition-all"
            >
              <h3 className="font-semibold text-foreground text-sm mb-1">
                {entry.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {entry.content}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
