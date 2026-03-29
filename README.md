<div align="center">

# BMW Talent Radar

### AI-Powered Executive Hiring Decision Support System for BMW Group

[![Built with Lovable](https://img.shields.io/badge/Built%20with-Lovable-ff69b4?style=for-the-badge)](https://lovable.dev)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)

**BMW Hackathon 2025 — Submission**

[Live Demo](https://lovable.dev/projects/a7995ddc-fdb2-4fdf-bdbe-60bf0c42ed2b) · [Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started)

</div>

---

## Problem

BMW Group's executive talent acquisition process lacks a **unified, data-driven decision support layer**. HR managers evaluate candidates across multiple dimensions — skills, retention risk, compensation benchmarks, and scenario planning — using disconnected tools and manual judgment.

**BMW Talent Radar** solves this by providing a real-time, AI-augmented workspace that consolidates all hiring intelligence into one coherent platform.

---

## Features

### Talent Radar
Real-time workforce overview with multi-dimensional candidate scoring, retention risk alerts, and leadership tagging. Deep Dive profiles give instant insight into each employee's compensation, tenure, and risk factors.

### Scenario Simulator
**BMW-specific hiring scenario engine** — simulate different workforce compositions, budget constraints, and strategic objectives to evaluate decision outcomes before committing.

### Executive Hiring
End-to-end executive recruitment pipeline. Track candidates from sourcing to offer, with AI-assisted fit scoring aligned to BMW's leadership competency framework.

### Compensation Pulse
Live compensation benchmarking engine — compare candidate expectations against market data and internal bands for senior and executive roles.

### AI Advisor
Natural language interface for hiring queries. Ask complex questions about candidates, roles, or market trends and receive structured, explainable recommendations.

---

## Tech Stack

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

---

## Getting Started

### Prerequisites
- Node.js 18+ or Bun

- ### Installation

- ```bash
  # Clone the repository
  git clone https://github.com/aberkkk/bmw-talent-sonar.git
  cd bmw-talent-sonar

  # Install dependencies
  npm install

  # Start development server
  npm run dev
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

  ## Project Structure

  ```
  src/
  ├── components/     # Reusable UI components
  ├── context/        # React context providers (theme)
  ├── data/           # Mock data & data models
  ├── hooks/          # Custom React hooks
  ├── lib/            # Utility functions
  ├── pages/          # Route-level page components
  │   ├── TalentRadar.tsx
  │   ├── ScenarioSimulator.tsx
  │   ├── ExecutiveHiring.tsx
  │   ├── CompensationPulse.tsx
  │   └── AIAdvisor.tsx
  └── test/           # Test suites
  ```

  ---

  ## AI & Decision Logic

  The platform is built around **explainable AI** principles:

  - **Retention risk scoring** — flags employees underpaid vs. market, short tenure, or high flight risk
  - - **Scenario modeling** — workforce planning simulations across budget and headcount variables
    - - **Ranking transparency** — every recommendation includes reasoning traces
      - - **Natural language queries** — the AI Advisor translates complex HR questions into actionable data insights
       
        - ---

        ## Business Value

        | Metric | Impact |
        |--------|--------|
        | Decision Speed | Reduces executive hiring cycle by up to **40%** |
        | Data Centralization | Unifies **5 distinct** hiring dimensions in one view |
        | Scenario Coverage | Simulates **N×M** workforce configurations instantly |
        | Explainability | Every recommendation includes a full reasoning trace |

        ---

        ## Team

        Built by **XA-108 Technologies** for the **BMW Hackathon 2025**

        ---

        ## License

        This project is open source. © 2025 XA-108 Technologies.
