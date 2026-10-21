# DataPath — My Data Engineering Journey 🚀

> A personalized, local-first learning companion and B.Tech semester academic tracker built to bridge college studies with real-world Data Engineering skills in 60 minutes a day.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

---

## 📌 Overview

**DataPath** is an all-in-one productivity and curriculum tracker crafted for students balancing rigorous university coursework (B.Tech CSE / AI & Data Science) while methodically building job-ready Data Engineering competence.

By dedicating **1 focused hour per day**, students cultivate continuous learning streaks, complete a 24-week progressive curriculum, build showcase portfolio pipelines, and track semester subjects without burnout.

---

## ✨ Key Features

### ⏱️ 1. Precision Study Habit Timer
* **Drift-Free Stopwatch**: Uses real timestamp delta calculation (`accumulatedMs + (now - startTime)`), eliminating browser background throttling drift.
* **Pause / Resume Protection**: Paused time is strictly excluded from qualifying study minutes.
* **Automatic Midnight Splitting**: Study sessions extending past midnight (00:00 local time) are automatically partitioned across their respective calendar dates.
* **Contextual Tagging**: Tag sessions by roadmap week, semester subject, project, or interview practice with learning notes.

### 🔥 2. Daily Goal & Streak Engine
* **60-Minute Qualifying Target**: A calendar day qualifies toward the streak if and only if $\ge 60$ valid study minutes are recorded.
* **Timezone-Safe Local Arithmetic**: Operates purely on local browser calendar dates (`YYYY-MM-DD`), preventing UTC rollover bugs.
* **Active Streak Preservation**: If yesterday was completed and today is still in progress, the streak remains intact rather than resetting prematurely.
* **Historical Record**: A broken streak resets the current count while preserving your lifetime longest streak.
* **Celebration & Milestones**: Confetti bursts and milestone badges at 3, 7, 14, and 30 consecutive qualifying days.

### 🗺️ 3. 24-Week Data Engineering Roadmap
A comprehensive, 6-phase curriculum tailored for 1 hour/day:
1. **Phase 1: Foundations** — Python for Data, Advanced Data Structures, OOP, and Scripting.
2. **Phase 2: Databases & SQL Mastery** — Relational schema design, advanced window functions, CTEs, indexing, and PostgreSQL.
3. **Phase 3: Data Warehousing & Modeling** — Dimensional modeling (Star/Snowflake schema), OLAP, ETL vs. ELT, and Snowflake.
4. **Phase 4: Big Data & Distributed Compute** — Apache Spark, PySpark transformations, caching, and partitioned data lakes.
5. **Phase 5: Data Orchestration & Pipelines** — Apache Airflow DAGs, cron scheduling, backfilling, and task dependencies.
6. **Phase 6: Streaming & Production Engineering** — Apache Kafka fundamentals, consumer groups, CI/CD, and monitoring.

### 📚 4. Semester Subjects & Exam Planner
* Track B.Tech semester subjects, university exam target dates, priorities, and credits.
* Unit-by-unit syllabus breakdowns with topic completion checkboxes.
* Spaced-repetition revision counter tracking the number of times each topic has been revised with last-revised timestamps.

### 🛠️ 5. Portfolio Projects Tracker
* Structured roadmap projects (e.g., *E-Commerce Analytics Pipeline*, *Batch Ingestion with Airflow & DuckDB*).
* Interactive sub-task checklists with automatic project status updates (`Not Started` $\rightarrow$ `In Progress` $\rightarrow$ `Completed`).
* GitHub repository link and architecture documentation fields.

### 💼 6. Internship Preparation Hub
* **Application Tracker**: Kanban-style status stages (`Interested`, `Preparing`, `Applied`, `Assessment`, `Interview`, `Offer`, `Rejected`).
* **Checklists**: Comprehensive readiness checklists for ATS-friendly resumes and polished GitHub repositories.
* **Practice Bank**: Topic-categorized interview problem tracker covering SQL queries, Python data algorithms, and system design.

### 💾 7. Local-First Privacy & Backup
* Zero account setup or remote database required: all study logs, topics, and notes stay private inside your browser's `localStorage`.
* **Reliable Backup Export**: Download your full data state anytime as a clean JSON file (`datapath-backup-YYYY-MM-DD.json`).
* **Instant Restore**: Re-import backup JSON files on any device or browser to restore all progress seamlessly.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tooling** | [Vite 8.3](https://vitejs.dev/) with native config ESM loader |
| **Styling & Theme** | [Tailwind CSS v4](https://tailwindcss.com/) + `@tailwindcss/vite` |
| **Icons & Visuals** | [Lucide React](https://lucide.dev/) & [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) |
| **Animations** | [Motion (Framer Motion)](https://motion.dev/) |
| **State & Storage** | React Context API + Local-first `localStorage` (`datapath_learning_state_v1`) |

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (version 20.x, 22.x, or 24.x recommended)
* `npm` (version 10 or later)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nagasripadala2107-git/data-path.git
   cd data-path
   ```

2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```
   *(Note: The `--legacy-peer-deps` flag ensures clean resolution with Vite 8).*

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to:
   **`http://localhost:3000/`**

---

## 📦 Available Scripts

* `npm run dev` — Starts the local development server at `http://localhost:3000/`.
* `npm run build` — Compiles and optimizes the production bundle into the `dist/` directory.
* `npm run preview` — Locally previews the built production bundle.
* `npm run lint` — Runs TypeScript type-checking without emitting files (`tsc --noEmit`).

---

## 📁 Project Structure

```
data-path/
├── package.json               # Dependencies, metadata, and scripts
├── vite.config.ts             # Vite 8 config with Tailwind v4 & path alias
├── tsconfig.json              # TypeScript compiler configuration
├── index.html                 # HTML entry with Google Web Fonts
└── src/
    ├── App.tsx                # Main view router & shell layout
    ├── main.tsx               # React root mount
    ├── index.css              # Tailwind CSS directives & color variables
    ├── types/
    │   └── index.ts           # Core domain interfaces (Session, Streak, Subject, etc.)
    ├── context/
    │   └── AppContext.tsx     # Global React state, timer loop, and storage actions
    ├── data/
    │   └── initialData.ts     # 24-week curriculum, semester syllabus & project templates
    ├── utils/
    │   ├── dateUtils.ts       # Streak math, local calendar dates & midnight split
    │   └── storage.ts         # LocalStorage persistence, JSON Blob export & import
    └── components/
        ├── layout/            # Navbar & Sidebar navigation
        ├── dashboard/         # Dashboard KPI cards & quick actions
        ├── timer/             # Daily study timer & live session logger
        ├── streak/            # Calendar view & monthly consistency grid
        ├── roadmap/           # 24-week study plan & visual roadmap tree
        ├── semester/          # University subjects, units, & revision counter
        ├── projects/          # Portfolio data pipeline tracker
        ├── internship/        # Application tracker & interview prep
        ├── logs/              # Historical daily study journal
        ├── resources/         # Curated DE learning links & docs
        ├── settings/          # Profile context, theme toggle, and JSON backup
        └── common/            # Celebration modals & badges
```

---

## 🔒 Data Privacy & Offline Resilience

* **Zero Tracking**: DataPath contains no third-party trackers, analytics, or remote database dependencies.
* **Offline Ready**: Works completely offline once loaded in your browser.
* **Portable Backups**: You own your learning records. Export your progress under `Settings` $\rightarrow$ `Export Backup (JSON)` at any time.

---

## 👤 Author & Context

Developed as a dedicated learning tracker for **B.Tech Computer Science & Engineering (Artificial Intelligence & Data Science)** students targeting Data Engineering careers.

* **GitHub**: [@nagasripadala2107-git](https://github.com/nagasripadala2107-git)
* **Project**: [DataPath — My Data Engineering Journey](https://github.com/nagasripadala2107-git/data-path)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
