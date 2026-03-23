# LifeNavigator AI

## Current State
New project. Empty workspace with no existing application.

## Requested Changes (Diff)

### Add
- Onboarding flow: age group (16-20, 21-25, 26-30, 31+) and main focus (Career, Education, Mental Wellness, Personal Growth, Relationships, Productivity)
- User profile storage with age group, focus area, name
- Dashboard with personalized greeting, daily motivation card, quick stats (goals count, mood streak, journal entries)
- AI Life Mentor Chat: conversational interface calling Gemini API via HTTP outcalls; maintains chat history per session; system prompt personalized to user profile
- Goal Planner: add/toggle/delete goals; AI can break goals into sub-steps via Gemini; goals stored in backend per user
- Mood Tracker: log daily mood (Happy, Motivated, Neutral, Stressed, Tired); view mood history; AI suggests based on mood pattern
- AI Journal: write entries; AI can summarize and suggest reflection points; entries stored in backend
- AI Decision Helper: describe a dilemma; AI returns pros/cons and decision framework
- Daily AI Motivation: stored motivational quotes and tips, one shown per day on dashboard
- Navigation: bottom tab bar (Home, Mentor, Goals, Mood, Journal)

### Modify
- N/A (new project)

### Remove
- N/A

## Implementation Plan
1. Backend: User profile CRUD, Goals CRUD, Mood log CRUD, Journal entries CRUD, HTTP outcall to Gemini API for AI features
2. Frontend: Onboarding flow, Dashboard, Chat screen, Goal Planner, Mood Tracker, Journal screen
3. Wire Gemini HTTP outcalls from backend for chat, goal breakdown, journal analysis, decision helper
