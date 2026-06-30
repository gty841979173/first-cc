# Pomodoro Timer Desktop App - Specification

## 1. Project Overview

- **Project Name**: Pomodoro Timer
- **Type**: Desktop Application (Tauri + Web)
- **Core Functionality**: A beautiful, functional Pomodoro timer with work/break sessions, session tracking, and system notifications
- **Target Users**: Productivity-focused individuals who use the Pomodoro Technique

## 2. UI/UX Specification

### Window Configuration
- **Window Size**: 360px width × 480px height
- **Window Style**: Standard window frame with native controls
- **Resizable**: No
- **Position**: Center of screen on launch

### Visual Design

#### Color Palette
| Role | Color | Hex Code |
|------|-------|----------|
| Background | Deep Charcoal | `#1a1a2e` |
| Card Background | Dark Navy | `#16213e` |
| Primary (Work) | Tomato Red | `#e94560` |
| Secondary (Break) | Calm Teal | `#0f969c` |
| Accent | Warm Gold | `#f5b041` |
| Text Primary | Pure White | `#ffffff` |
| Text Secondary | Soft Gray | `#a0a0a0` |
| Progress Track | Muted Navy | `#2a3a5e` |

#### Typography
- **Font Family**: "SF Pro Display", system-ui, -apple-system, sans-serif
- **Timer Display**: 72px, bold, letter-spacing: -2px
- **Session Label**: 18px, semibold, uppercase, letter-spacing: 3px
- **Button Text**: 14px, semibold
- **Stats Text**: 16px, regular

#### Spacing System
- Base unit: 8px
- Card padding: 24px
- Button padding: 12px 32px
- Section gaps: 24px
- Element gaps: 16px

### Layout Structure

```
┌────────────────────────────────┐
│          Window Title          │
├────────────────────────────────┤
│                                │
│      ┌──────────────────┐      │
│      │   Session Type   │      │
│      │     (WORK)       │      │
│      └──────────────────┘      │
│                                │
│      ┌──────────────────┐      │
│      │                  │      │
│      │   Circular Timer │      │
│      │     25:00        │      │
│      │                  │      │
│      └──────────────────┘      │
│                                │
│   [ Start ]  [ Reset ]         │
│                                │
│      ┌──────────────────┐      │
│      │  Session: 3/4    │      │
│      │  [Work][Short][Long]│   │
│      └──────────────────┘      │
│                                │
└────────────────────────────────┘
```

### Components

#### Circular Progress Ring
- Outer diameter: 240px
- Track width: 12px
- Progress width: 12px
- Rounded caps on progress arc
- Smooth animation (1 second intervals)
- Color changes based on session type

#### Timer Display
- Centered inside circular progress ring
- Format: MM:SS
- Font: 72px bold

#### Control Buttons
- **Start/Pause Button**
  - Size: 120px × 48px
  - Background: Primary color (changes to Secondary when paused)
  - Border-radius: 24px (pill shape)
  - States: Default, Hover (brightness +10%), Active (scale 0.98)

- **Reset Button**
  - Size: 80px × 48px
  - Background: Transparent with border
  - Border: 2px solid Text Secondary
  - Border-radius: 24px
  - Hover: Border and text become Primary color

#### Session Type Indicator
- Three tabs: WORK | SHORT BREAK | LONG BREAK
- Active tab: Primary color underline (3px)
- Inactive tabs: Text Secondary color
- Click to switch session type (resets current timer)

#### Stats Display
- Shows completed pomodoros: "🍅 3/4"
- Subtle card background

## 3. Functional Specification

### Core Features

#### Timer Functionality
1. **Work Session**: 25 minutes (1500 seconds)
2. **Short Break**: 5 minutes (300 seconds)
3. **Long Break**: 15 minutes (900 seconds)
4. Long break triggers after every 4 completed work sessions

#### Timer States
- **Idle**: Timer not running, showing full duration
- **Running**: Countdown active, updating every second
- **Paused**: Timer stopped, preserves remaining time
- **Completed**: Session finished, triggers notification and sound

#### User Interactions
1. **Start Button**: Begins countdown from current time
2. **Pause Button**: Stops countdown, preserves remaining time
3. **Reset Button**: Returns to idle state with full duration
4. **Session Tabs**: Switches session type (only when idle)
5. **Keyboard Shortcuts**:
   - Space: Start/Pause toggle
   - R: Reset timer

#### Notifications
- System notification when session completes
- Notification title: "Pomodoro Timer"
- Notification body: "[Session Type] completed! Time for a [next session]."
- Sound: System default notification sound

#### Auto-advance
- After work session: Auto-start short break after 3 seconds
- After break session: Auto-start work session after 3 seconds
- Show countdown overlay before auto-starting

### Data Flow

```
User Input → State Machine → Timer Logic → UI Update
                ↓
          Notification Service
                ↓
          Session Tracker
```

### Key Modules

1. **TimerEngine**
   - Manages countdown logic
   - Handles pause/resume
   - Emits tick events

2. **SessionManager**
   - Tracks completed sessions
   - Determines long break timing
   - Manages session history

3. **NotificationService**
   - Sends system notifications
   - Plays completion sound

4. **UIController**
   - Renders timer state
   - Handles user input
   - Animates progress ring

### Edge Cases
- Closing app during active session: Timer stops, no state persistence needed
- Switching session type while running: Confirm dialog or auto-reset
- System sleep: Timer continues from remaining time on wake

## 4. Acceptance Criteria

### Visual Checkpoints
- [ ] Window opens centered at 360×480
- [ ] Dark theme with specified colors renders correctly
- [ ] Circular progress ring displays with smooth animation
- [ ] Timer digits update every second
- [ ] Buttons have hover/active states
- [ ] Session tabs highlight active selection

### Functional Checkpoints
- [ ] Start begins countdown from 25:00
- [ ] Pause stops countdown, preserves time
- [ ] Reset returns to full duration
- [ ] Session completes at 00:00
- [ ] System notification appears on completion
- [ ] Short break follows work session
- [ ] Long break triggers after 4 work sessions
- [ ] Space key toggles start/pause
- [ ] R key resets timer

### Performance
- [ ] UI remains responsive during countdown
- [ ] Memory usage stays under 100MB
- [ ] App launches in under 2 seconds
