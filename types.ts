
export type Mood = 1 | 2 | 3 | 4 | 5; // 1: Sad, 3: Neutral, 5: Happy

export type PhysicalActivity = 'None' | 'Light' | 'Heavy';

export interface AuthUser {
  name: string;
  email: string;
  picture: string;
  id: string;
}

export interface EventLog {
  id: string;
  type: 'Argument' | 'Small Win' | 'Feedback' | 'Unexpected';
  intensity: number; // 1-5
  note?: string;
  timestamp: number;
}

export interface DailyLog {
  date: string;
  mood: Mood;
  stress: number;
  energy: number;
  sleepQuality: number;
  workload: number;
  activity: PhysicalActivity;
  events: EventLog[];
}

export interface MindfulnessReminder {
  id: string;
  label: string;
  targetEventType: EventLog['type'] | 'Any';
  isActive: boolean;
}

export interface ThreadState {
  type: 'Stress' | 'Fatigue' | 'Conflict' | 'Success';
  level: number; // 0-10
}

export interface InsightCard {
  title: string;
  description: string;
  type: 'cause-effect' | 'pattern' | 'suggestion';
}

export interface WeeklyInsight {
  weekStart: string;
  summary: string;
  story: string; // Narrative summary for "Thread Stories"
  forecast: string; // "Gentle Forecast"
  cards: InsightCard[];
  threadStatuses: {
    type: string;
    status: 'Stable' | 'Sensitive' | 'Volatile';
    description: string;
  }[];
  suggestions: string[];
}

export interface UserSettings {
  preferredCheckInTime: string;
  checkInDays: number[]; // 0 for Sunday, 1 for Monday, etc.
  onboardingCompleted: boolean;
  theme: 'light' | 'dark';
  mindfulnessReminders: MindfulnessReminder[];
  quietMode: boolean; // New: Toggle for analysis/nudging
  milestones: {
    totalAwareness: number; // Sum of logs/events for "Milestones"
  };
}
