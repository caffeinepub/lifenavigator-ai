import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import OutCall "http-outcalls/outcall";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  type Author = {
    #user;
    #assistant;
    #ai;
  };

  type GeminiMessage = {
    role : Author;
    content : Text;
  };

  module GeminiMessage {
    public func toText(message : GeminiMessage) : Text {
      "{\"role\": \"" # getRoleText(message) # "\", \"content\": \"" # message.content # "\"}";
    };

    func getRoleText(message : GeminiMessage) : Text {
      switch (message.role) {
        case (#user) { "user" };
        case (#assistant) { "assistant" };
        case (#ai) { "ai" };
      };
    };
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    ageGroup : Text;
    focusArea : Text;
  };

  public type Goal = {
    description : Text;
    completed : Bool;
  };

  public type MoodEntry = {
    mood : Text;
    note : Text;
  };

  public type JournalEntry = {
    title : Text;
    content : Text;
  };

  module JournalEntry {
    public func compare(j1 : JournalEntry, j2 : JournalEntry) : Order.Order {
      Text.compare(j1.title, j2.title);
    };
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let userGoals = Map.empty<Principal, List.List<Goal>>();
  let userMoodLogs = Map.empty<Principal, List.List<MoodEntry>>();
  let userJournals = Map.empty<Principal, List.List<JournalEntry>>();

  // Profile management
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Goal functionality
  public shared ({ caller }) func addGoal(description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add goals");
    };

    let goalList = switch (userGoals.get(caller)) {
      case (null) {
        let newGoalList = List.empty<Goal>();
        userGoals.add(caller, newGoalList);
        newGoalList;
      };
      case (?list) { list };
    };
    goalList.add({ description; completed = false });
  };

  public shared ({ caller }) func toggleGoalCompletion(goalId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can toggle goals");
    };

    switch (userGoals.get(caller)) {
      case (null) { Runtime.trap("Goal not found") };
      case (?goalList) {
        if (goalId >= goalList.size()) { Runtime.trap("Invalid goal id") };
        let goalsArray = goalList.toArray();
        if (goalId >= goalsArray.size()) { Runtime.trap("Invalid goal id") };
        let goal = goalsArray[goalId];
        let updatedGoal = { description = goal.description; completed = not goal.completed };
        goalList.add(updatedGoal);
      };
    };
  };

  public query ({ caller }) func getGoals(user : Principal) : async [Goal] {
    if (caller != user and not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Can only view your own goals");
    };
    switch (userGoals.get(user)) {
      case (null) { [] };
      case (?goalList) { goalList.toArray() };
    };
  };

  // Mood logs
  public shared ({ caller }) func addMoodEntry(mood : Text, note : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add mood entries");
    };

    let moodList = switch (userMoodLogs.get(caller)) {
      case (null) {
        let newMoodList = List.empty<MoodEntry>();
        userMoodLogs.add(caller, newMoodList);
        newMoodList;
      };
      case (?list) { list };
    };
    moodList.add({ mood; note });
  };

  public query ({ caller }) func getMoodLogs(user : Principal) : async [MoodEntry] {
    if (caller != user and not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Can only view your own mood logs");
    };
    switch (userMoodLogs.get(user)) {
      case (null) { [] };
      case (?moodList) { moodList.toArray() };
    };
  };

  // Journal entries
  public shared ({ caller }) func addJournalEntry(title : Text, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add journal entries");
    };

    let journalList = switch (userJournals.get(caller)) {
      case (null) {
        let newJournalList = List.empty<JournalEntry>();
        userJournals.add(caller, newJournalList);
        newJournalList;
      };
      case (?list) { list };
    };
    journalList.add({ title; content });
  };

  public query ({ caller }) func getJournalEntries(owner : Principal) : async [JournalEntry] {
    if (caller != owner and not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Can only view your own journal entries");
    };
    switch (userJournals.get(owner)) {
      case (null) { [] };
      case (?journalList) { journalList.toArray().sort() };
    };
  };

  // Daily motivation
  let quotes = [
    "Believe you can and you're halfway there.",
    "The only way to do great work is to love what you do.",
    "Success is not final, failure is not fatal.",
    "Stay hungry, stay foolish.",
    "Don't watch the clock; do what it does. Keep going.",
    "The secret of getting ahead is getting started.",
    "You are capable of amazing things.",
  ];

  public query func getDailyMotivation(dayOfWeek : Nat) : async Text {
    if (dayOfWeek >= quotes.size()) {
      Runtime.trap("Invalid day of week");
    };
    quotes[dayOfWeek];
  };

  // AI Chat (HTTP Outcall)
  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func aiChat(messages : [GeminiMessage], userProfile : UserProfile, apiKey : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can use AI chat");
    };

    await OutCall.httpPostRequest(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" # apiKey,
      [],
      "{ \"contents\": " # messages.toText() # "}",
      transform
    );
  };
};
