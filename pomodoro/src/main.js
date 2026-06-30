const { invoke } = window.__TAURI__.core;
const { isPermissionGranted, requestPermission, sendNotification } = window.__TAURI__.notification;

const DURATIONS = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const SESSION_NAMES = {
  work: "Work Session",
  shortBreak: "Short Break",
  longBreak: "Long Break",
};

const CIRCUMFERENCE = 2 * Math.PI * 108;

class PomodoroTimer {
  constructor() {
    this.state = "idle";
    this.currentType = "work";
    this.remainingTime = DURATIONS.work;
    this.completedPomodoros = 0;
    this.intervalId = null;
    this.autoAdvanceTimeout = null;

    this.initElements();
    this.initEventListeners();
    this.updateDisplay();
    this.checkNotificationPermission();
  }

  initElements() {
    this.timerDisplay = document.querySelector(".timer-time");
    this.progressRing = document.querySelector(".progress-ring-progress");
    this.startBtn = document.getElementById("startBtn");
    this.resetBtn = document.getElementById("resetBtn");
    this.completedEl = document.getElementById("completedPomodoros");
    this.tabs = document.querySelectorAll(".tab");
    this.timerContainer = document.querySelector(".timer-container");
  }

  initEventListeners() {
    this.startBtn.addEventListener("click", () => this.toggleTimer());
    this.resetBtn.addEventListener("click", () => this.reset());

    this.tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        if (this.state === "running") return;
        this.switchSession(tab.dataset.type);
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        this.toggleTimer();
      } else if (e.code === "KeyR") {
        this.reset();
      }
    });
  }

  async checkNotificationPermission() {
    let permissionGranted = await isPermissionGranted();
    if (!permissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === "granted";
    }
  }

  toggleTimer() {
    if (this.state === "running") {
      this.pause();
    } else {
      this.start();
    }
  }

  start() {
    this.state = "running";
    this.startBtn.textContent = "PAUSE";
    this.startBtn.classList.remove("paused");

    this.intervalId = setInterval(() => {
      this.remainingTime--;
      this.updateDisplay();

      if (this.remainingTime <= 0) {
        this.completeSession();
      }
    }, 1000);
  }

  pause() {
    this.state = "paused";
    clearInterval(this.intervalId);
    this.startBtn.textContent = "START";
    this.startBtn.classList.add("paused");
  }

  reset() {
    this.state = "idle";
    clearInterval(this.intervalId);
    clearTimeout(this.autoAdvanceTimeout);
    this.remainingTime = DURATIONS[this.currentType];
    this.startBtn.textContent = "START";
    this.startBtn.classList.remove("paused");
    this.updateDisplay();
  }

  switchSession(type) {
    if (this.state === "running") return;

    this.currentType = type;
    this.remainingTime = DURATIONS[type];
    this.state = "idle";

    this.tabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.type === type);
    });

    this.timerContainer.dataset.type = type;
    this.updateDisplay();
  }

  async completeSession() {
    this.state = "completed";
    clearInterval(this.intervalId);

    if (this.currentType === "work") {
      this.completedPomodoros++;
      this.completedEl.textContent = this.completedPomodoros;
    }

    await this.sendCompletionNotification();

    const nextType = this.getNextSessionType();
    this.autoAdvanceTimeout = setTimeout(() => {
      this.switchSession(nextType);
      this.start();
    }, 3000);
  }

  getNextSessionType() {
    if (this.currentType === "work") {
      if (this.completedPomodoros % 4 === 0) {
        return "longBreak";
      }
      return "shortBreak";
    }
    return "work";
  }

  async sendCompletionNotification() {
    const permissionGranted = await isPermissionGranted();
    if (permissionGranted) {
      const currentName = SESSION_NAMES[this.currentType];
      const nextName = SESSION_NAMES[this.getNextSessionType()];
      sendNotification({
        title: "Pomodoro Timer",
        body: `${currentName} completed! Time for a ${nextName}.`,
      });
    }
  }

  updateDisplay() {
    const minutes = Math.floor(this.remainingTime / 60);
    const seconds = this.remainingTime % 60;
    this.timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    const totalTime = DURATIONS[this.currentType];
    const progress = this.remainingTime / totalTime;
    const offset = CIRCUMFERENCE * (1 - progress);
    this.progressRing.style.strokeDashoffset = offset;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  new PomodoroTimer();
});
