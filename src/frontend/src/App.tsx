import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useUserProfile } from "./hooks/useQueries";
import LandingPage from "./pages/LandingPage";
import MainApp from "./pages/MainApp";
import Onboarding from "./pages/Onboarding";

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: profile, isLoading: profileLoading } = useUserProfile();

  if (isInitializing || (isAuthenticated && profileLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-2xl">🧠</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Loading LifeNavigator AI…
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      {!isAuthenticated && <LandingPage />}
      {isAuthenticated && !profile && <Onboarding />}
      {isAuthenticated && profile && <MainApp profile={profile} />}
    </>
  );
}
