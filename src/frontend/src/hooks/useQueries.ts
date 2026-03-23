import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { GeminiMessage, UserProfile } from "../backend.d";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("No actor");
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["userProfile"] }),
  });
}

export function useDailyMotivation() {
  const { actor, isFetching } = useActor();
  const day = BigInt(new Date().getDay());
  return useQuery({
    queryKey: ["dailyMotivation", day.toString()],
    queryFn: async () => {
      if (!actor)
        return "Stay focused and keep moving forward. Every step counts!";
      return actor.getDailyMotivation(day);
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 60,
  });
}

export function useGoals() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery({
    queryKey: ["goals"],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getGoals(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useAddGoal() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (description: string) => {
      if (!actor) throw new Error("No actor");
      await actor.addGoal(description);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }),
  });
}

export function useToggleGoal() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (index: number) => {
      if (!actor) throw new Error("No actor");
      await actor.toggleGoalCompletion(BigInt(index));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }),
  });
}

export function useMoodLogs() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery({
    queryKey: ["moodLogs"],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getMoodLogs(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useAddMood() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ mood, note }: { mood: string; note: string }) => {
      if (!actor) throw new Error("No actor");
      await actor.addMoodEntry(mood, note);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["moodLogs"] }),
  });
}

export function useJournalEntries() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery({
    queryKey: ["journalEntries"],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getJournalEntries(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useAddJournalEntry() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      content,
    }: { title: string; content: string }) => {
      if (!actor) throw new Error("No actor");
      await actor.addJournalEntry(title, content);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["journalEntries"] }),
  });
}

export function useAiChat() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      messages,
      profile,
    }: {
      messages: GeminiMessage[];
      profile: UserProfile;
    }) => {
      if (!actor) throw new Error("No actor");
      const apiKey = "AIzaSyDJg8-dkqd7yuyMguOKGWnnpPtYQ62Cyx8";
      return actor.aiChat(messages, profile, apiKey);
    },
  });
}
