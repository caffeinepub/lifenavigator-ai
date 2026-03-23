import { BookOpen, Home, MessageCircle, SmilePlus, Target } from "lucide-react";
import { useState } from "react";
import type { UserProfile } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import ChatMentor from "./ChatMentor";
import Dashboard from "./Dashboard";
import GoalPlanner from "./GoalPlanner";
import Journal from "./Journal";
import MoodTracker from "./MoodTracker";

type Tab = "home" | "mentor" | "goals" | "mood" | "journal";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "home", label: "Home", icon: <Home className="w-5 h-5" /> },
  {
    id: "mentor",
    label: "Mentor",
    icon: <MessageCircle className="w-5 h-5" />,
  },
  { id: "goals", label: "Goals", icon: <Target className="w-5 h-5" /> },
  { id: "mood", label: "Mood", icon: <SmilePlus className="w-5 h-5" /> },
  { id: "journal", label: "Journal", icon: <BookOpen className="w-5 h-5" /> },
];

export default function MainApp({ profile }: { profile: UserProfile }) {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const { clear } = useInternetIdentity();

  return (
    <div className="flex justify-center min-h-screen bg-muted">
      <div className="w-full max-w-md bg-background flex flex-col relative shadow-2xl min-h-screen">
        <header className="px-5 py-3.5 flex items-center justify-between border-b border-border bg-card sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
              LN
            </div>
            <span className="font-semibold text-foreground text-sm">
              LifeNavigator AI
            </span>
          </div>
          <button
            type="button"
            data-ocid="app.logout_button"
            onClick={clear}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Logout
          </button>
        </header>

        <main className="flex-1 overflow-y-auto pb-20">
          {activeTab === "home" && (
            <Dashboard profile={profile} onNavigate={setActiveTab} />
          )}
          {activeTab === "mentor" && <ChatMentor profile={profile} />}
          {activeTab === "goals" && <GoalPlanner />}
          {activeTab === "mood" && <MoodTracker />}
          {activeTab === "journal" && <Journal />}
        </main>

        <nav className="absolute bottom-0 w-full bg-card border-t border-border px-2 py-2 flex justify-around z-20">
          {TABS.map((tab) => (
            <button
              type="button"
              key={tab.id}
              data-ocid={`app.${tab.id}_tab`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                activeTab === tab.id
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon}
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
