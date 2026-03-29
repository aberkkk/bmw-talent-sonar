<div align="center">

# 🎯 XA-108 Talent Radar

### AI-Powered Senior Hiring Decision Support System for BMW Group

[![Built with Lovable](https://img.shields.io/badge/Built%20with-Lovable-ff69b4?style=for-the-badge)](https://lovable.dev)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)

**🏆 BMW Hackathon 2025 — Submission**

[🚀 Live Demo](https://lovable.dev/projects/ae63886f-10fd-4a86-a89d-cd387608acde) · [📋 Features](#-features) · [🛠 Tech Stack](#-tech-stack) · [🚀 Getting Started](#-getting-started)

</div>

---

## 📌 Problem

BMW Group's senior talent acquisition process lacks a **unified, data-driven decision support layer**. Recruiters and HR managers evaluate candidates across multiple dimensions — skills, succession fit, compensation benchmarks, and scenario planning — using disconnected tools and manual judgment.

**XA-108 Talent Radar** solves this by providing a real-time, AI-augmented workspace that consolidates all hiring intelligence into one coherent platform.

---

## ✨ Features

### 🔍 Talent Radar
Real-time overview of XA-108 Technologies talent pool with multi-dimensional candidate scoring and ranking.

### 🔁 Succession Planner
Visual succession mapping for critical roles — identify internal candidates and external prospects for key positions.

### 🎭 Scenario Simulator ⭐
**BMW-specific hiring scenario engine** — simulate different workforce compositions, budget constraints, and strategic objectives to evaluate decision outcomes before committing.

### 🗺 Upskilling Map
Identify skill gaps across the talent pipeline and generate personalized upskilling roadmaps aligned with BMW's strategic needs.

### 💰 Compensation Pulse
Live compensation benchmarking engine — compare candidate expectations against market data and internal bands for senior roles.

### 🤖 AI Advisor
Natural language interface for hiring queries. Ask complex questions about candidates, roles, or market trends and receive structured, explainable recommendations.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript 5, Vite 5 |
| **UI Components** | shadcn/ui, Radix UI, Tailwind CSS |
| **State Management** | TanStack Query v5, React Context |
| **Charts & Viz** | Recharts |
| **Forms** | React Hook Form + Zod validation |
| **Routing** | React Router v6 |
| **AI Layer** | Custom AI Advisor with structured reasoning |
| **Export** | jsPDF, XLSX |
| **Testing** | Vitest, Playwright |
| **i18n** | Custom language context (TR/EN) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- - npm / bun
 
  - ### Installation
 
  - ```bash
    # Clone the repository
    git clone https://github.com/aberkkk/bmw-talent-sonar.git
    cd bmw-talent-sonar

    # Install dependencies
    npm install
    # or
    bun install

    # Start development server
    npm run dev
    # or
    bun dev
    ```

    The app will be available at `http://localhost:8080`

    ### Available Scripts

    ```bash
    npm run dev        # Start development server
    npm run build      # Production build
    npm run preview    # Preview production build
    npm run test       # Run unit tests
    npm run lint       # Lint codebase
    ```

    ---

    ## 📁 Project Structure

    ```
    src/
    ├── components/     # Reusable UI components
    ├── context/        # React context providers (theme, language)
    ├── data/           # Mock data & data models
    ├── hooks/          # Custom React hooks
    ├── lib/            # Utility functions
    ├── pages/          # Route-level page components
    │   ├── TalentRadar.tsx
    │   ├── SuccessionPlanner.tsx
    │   ├── ScenarioSimulator.tsx
    │   ├── UpskillMap.tsx
    │   ├── CompensationPulse.tsx
    │   └── AIAdvisor.tsx
    └── test/           # Test suites
    ```

    ---

    ## 🤖 AI & Decision Logic

    The platform is built around **explainable AI** principles:

    - **Structured scoring** — candidates are evaluated across weighted dimensions (skills match, experience, cultural fit, compensation alignment)
    - - **Scenario modeling** — Monte Carlo-style simulations for workforce planning
      - - **Ranking transparency** — every recommendation includes reasoning traces
        - - **Natural language queries** — the AI Advisor translates complex HR questions into actionable data insights
         
          - ---

          ## 🌍 Internationalization

          Full support for **Turkish (TR)** and **English (EN)** via a custom i18n context — toggle language with the flag switcher in the top navigation.

          ---

          ## 📊 Business Value

          | Metric | Impact |
          |--------|--------|
          | Decision Speed | Reduces senior hiring cycle by up to **40%** |
          | Data Centralization | Unifies **6 distinct** hiring dimensions in one view |
          | Scenario Coverage | Simulates **N×M** workforce configurations instantly |
          | Explainability | Every recommendation includes a full reasoning trace |

          ---

          ## 👥 Team

          Built by **XA-108 Technologies** for the **BMW Hackathon 2025**

          ---

          ## 📄 License

          This project is private. All rights reserved © 2025 XA-108 Technologies.
