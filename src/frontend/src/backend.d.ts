import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Goal {
    completed: boolean;
    description: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface JournalEntry {
    title: string;
    content: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface GeminiMessage {
    content: string;
    role: Author;
}
export interface UserProfile {
    focusArea: string;
    ageGroup: string;
}
export interface MoodEntry {
    mood: string;
    note: string;
}
export enum Author {
    ai = "ai",
    user = "user",
    assistant = "assistant"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addGoal(description: string): Promise<void>;
    addJournalEntry(title: string, content: string): Promise<void>;
    addMoodEntry(mood: string, note: string): Promise<void>;
    aiChat(messages: Array<GeminiMessage>, userProfile: UserProfile, apiKey: string): Promise<string>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDailyMotivation(dayOfWeek: bigint): Promise<string>;
    getGoals(user: Principal): Promise<Array<Goal>>;
    getJournalEntries(owner: Principal): Promise<Array<JournalEntry>>;
    getMoodLogs(user: Principal): Promise<Array<MoodEntry>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    toggleGoalCompletion(goalId: bigint): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
