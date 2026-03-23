import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useSaveUserProfile } from "../hooks/useQueries";

const AGE_GROUPS = ["16-20", "21-25", "26-30", "31+"];
const FOCUS_AREAS = [
  "Career",
  "Education",
  "Mental Wellness",
  "Personal Growth",
  "Relationships",
  "Productivity",
];

export default function Onboarding() {
  const [step, setStep] = useState<1 | 2>(1);
  const [ageGroup, setAgeGroup] = useState("");
  const { mutateAsync: saveProfile, isPending } = useSaveUserProfile();

  const handleAge = (age: string) => {
    setAgeGroup(age);
    setStep(2);
  };

  const handleFocus = async (focusArea: string) => {
    try {
      await saveProfile({ ageGroup, focusArea });
    } catch {
      toast.error("Failed to save profile. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
            LN
          </div>
          <span className="font-semibold text-foreground">
            LifeNavigator AI
          </span>
        </div>

        <div className="flex gap-2 mb-8">
          <div
            className={`h-1.5 flex-1 rounded-full transition-all ${step >= 1 ? "bg-primary" : "bg-border"}`}
          />
          <div
            className={`h-1.5 flex-1 rounded-full transition-all ${step >= 2 ? "bg-primary" : "bg-border"}`}
          />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-2">
                What's your age group?
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                This helps us personalize your experience.
              </p>
              <div className="space-y-3" data-ocid="onboarding.age_group.panel">
                {AGE_GROUPS.map((age) => (
                  <button
                    type="button"
                    key={age}
                    data-ocid="onboarding.age_group.button"
                    onClick={() => handleAge(age)}
                    className="w-full text-left p-4 rounded-2xl border-2 border-border hover:border-primary hover:bg-primary/5 font-medium text-foreground transition-all"
                  >
                    {age}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-2">
                What's your main focus?
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Choose the area where you want the most support.
              </p>
              <div
                className="space-y-3"
                data-ocid="onboarding.focus_area.panel"
              >
                {FOCUS_AREAS.map((area) => (
                  <button
                    type="button"
                    key={area}
                    data-ocid="onboarding.focus_area.button"
                    onClick={() => handleFocus(area)}
                    disabled={isPending}
                    className="w-full text-left p-4 rounded-2xl border-2 border-border hover:border-primary hover:bg-primary/5 font-medium text-foreground transition-all disabled:opacity-50"
                  >
                    {area}
                  </button>
                ))}
              </div>
              {isPending && (
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Setting up your profile…
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {step === 2 && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-4"
            onClick={() => setStep(1)}
          >
            ← Back
          </Button>
        )}
      </div>
    </div>
  );
}
