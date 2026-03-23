import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  MessageCircle,
  SmilePlus,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const FEATURES = [
  {
    icon: <MessageCircle className="w-5 h-5" />,
    title: "AI Mentor Chat",
    description:
      "Get thoughtful, empathetic advice on career, relationships, and personal growth — 24/7.",
  },
  {
    icon: <Target className="w-5 h-5" />,
    title: "Goal Planner",
    description:
      "Break big goals into achievable steps and track your progress every day.",
  },
  {
    icon: <SmilePlus className="w-5 h-5" />,
    title: "Mood Tracker",
    description:
      "Log how you feel and receive personalized tips to boost your wellbeing.",
  },
  {
    icon: <BookOpen className="w-5 h-5" />,
    title: "Smart Journaling",
    description:
      "Write your thoughts and let AI surface insights and patterns in your journey.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Set Your Profile",
    desc: "Tell us your age group and main focus area so your AI mentor can personalize guidance.",
  },
  {
    num: "02",
    title: "Chat with AI",
    desc: "Ask anything about life, career, relationships, or wellbeing and receive instant, thoughtful advice.",
  },
  {
    num: "03",
    title: "Track Progress",
    desc: "Log moods, check off goals, and journal daily to see your growth over time.",
  },
];

export default function LandingPage() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
            LN
          </div>
          <span className="font-semibold text-foreground text-sm hidden sm:block">
            LifeNavigator AI
          </span>
        </div>
        <Button
          data-ocid="landing.login_button"
          onClick={login}
          disabled={isLoggingIn}
          className="rounded-full px-5 text-sm"
        >
          {isLoggingIn ? "Connecting…" : "Get Started Free"}
        </Button>
      </header>

      {/* Hero */}
      <section className="px-6 pt-12 pb-24 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl p-8 sm:p-12 text-center"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.77 0.12 295), oklch(0.78 0.1 265), oklch(0.89 0.06 215))",
          }}
        >
          <div className="inline-flex items-center gap-2 bg-white/30 rounded-full px-4 py-1.5 text-xs font-semibold text-foreground mb-6 uppercase tracking-wide">
            <Zap className="w-3 h-3" /> Powered by Gemini AI
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight mb-4">
            Your Personal
            <br />
            AI Life Mentor
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto mb-8">
            Get thoughtful guidance, track goals, and grow every day — powered
            by AI that truly understands you.
          </p>
          <Button
            data-ocid="landing.hero_cta_button"
            size="lg"
            onClick={login}
            disabled={isLoggingIn}
            className="rounded-full px-8 text-base shadow-card"
          >
            {isLoggingIn ? "Connecting…" : "Start Free Trial"}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-6 pb-24 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-foreground mb-3">
            Everything you need to grow
          </h2>
          <p className="text-muted-foreground">
            Four powerful tools in one calm, focused app.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-6 border border-border shadow-card"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 pb-24 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-3">
            How it works
          </h2>
          <p className="text-muted-foreground">
            Three simple steps to a better you.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-5xl font-bold text-primary/20 mb-3">
                {s.num}
              </div>
              <h3 className="font-semibold text-foreground text-lg mb-2">
                {s.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 pb-24 max-w-6xl mx-auto">
        <div
          className="rounded-3xl p-10 text-center"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.44 0.18 270), oklch(0.55 0.2 285))",
          }}
        >
          <TrendingUp className="w-10 h-10 text-white/70 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Start your growth journey today
          </h2>
          <p className="text-white/80 mb-6">
            Join thousands of people using LifeNavigator AI to live with more
            clarity and purpose.
          </p>
          <Button
            data-ocid="landing.cta_bottom_button"
            variant="secondary"
            size="lg"
            onClick={login}
            disabled={isLoggingIn}
            className="rounded-full px-8"
          >
            {isLoggingIn ? "Connecting…" : "Get Started — It's Free"}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="px-6 py-10 text-center"
        style={{ background: "oklch(0.12 0.04 265)" }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-primary/80 flex items-center justify-center text-white text-xs font-bold">
            LN
          </div>
          <span className="text-white font-semibold text-sm">
            LifeNavigator AI
          </span>
        </div>
        <p className="text-white/40 text-xs">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            className="underline hover:text-white/70"
            target="_blank"
            rel="noopener noreferrer"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
