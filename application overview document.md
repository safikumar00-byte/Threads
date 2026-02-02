
# Threads: Gentle Pattern Tracker - Application Overview

## 1. Executive Summary
**Threads** is a specialized mindfulness and behavioral tracking application designed to help users identify hidden rhythms in their daily lives. Unlike traditional "productivity" or "mood" apps that can feel judgmental or clinical, Threads focuses on the "tracing" of patterns over time using a non-intrusive UI and Gemini-powered narrative insights.

## 2. Core Philosophy
The application is built on three pillars:
- **Observation over Judgment:** Users "trace threads" rather than "completing tasks."
- **Pattern Recognition:** Using AI to find correlations that are invisible to the user.
- **Storytelling:** Converting cold data into warm narrative "Thread Stories."
- **Soft Forecasting:** Suggesting potential upcoming patterns based on current trends.

## 3. Technical Stack
- **Framework:** React 19.
- **Styling:** Tailwind CSS + Custom Keyframe Animations (Glow/Vibrate).
- **State Management:** React Context + LocalStorage.
- **AI Engine:** Google Gemini API (`gemini-3-flash-preview`).

## 4. Enhanced Features

### 4.1 Thread Stories (Narrative AI)
The app uses Gemini to generate a narrative summary of the week. This turns statistics into stories, which are more memorable and emotionally resonant for behavioral awareness.

### 4.2 Gentle Forecasts
Insights now include a "Gentle Forecast"—a non-deterministic suggestion of how tomorrow might feel based on current sleep, stress, and energy trends.

### 4.3 Tactile UI
Thread bars are alive:
- **Volatile (Level > 7):** Vibrate slightly and pulse with a red glow.
- **Stable (Level < 3):** Glow softly with an emerald pulse.
- **Transitions:** Use elastic cubic-bezier stretching for bar updates.

### 4.4 Milestone Moments
Instead of "streaks" (which punish missing a day), Threads rewards "Moments of Awareness." Every check-in and event logged contributes to awareness milestones (10, 50, 100 moments).

### 4.5 Quiet Mode
A trust-building feature that allows users to disable AI analysis and reminders for days when they simply want to observe without being analyzed.

## 5. Architecture & Algorithm
The "Threads" algorithm implements a "leaky bucket" logic with daily decay (0.5 units) and accumulation based on micro-events and routine metrics. Milestones are tracked via `UserSettings.milestones`. AI insights are requested every 3 logs unless Quiet Mode is active.
