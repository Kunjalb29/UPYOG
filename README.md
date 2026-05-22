# UPYOG Property Tax Analytics Dashboard — Multi-Tenant Platform

[![Platform Version](https://img.shields.io/badge/Version-v1.0.0-indigo.svg?style=flat-square)](https://github.com/Kunjalb29/UPYOG)
[![React](https://img.shields.io/badge/React-19.0-blue.svg?style=flat-square)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple.svg?style=flat-square)](https://vitejs.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg?style=flat-square)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind--CSS-v4.0-38bdf8.svg?style=flat-square)](https://tailwindcss.com)
[![Google Gemini API](https://img.shields.io/badge/Gemini--AI-1.5--Flash-pink.svg?style=flat-square)](https://aistudio.google.com)
[![License](https://img.shields.io/badge/License-Municipal--Authorized-emerald.svg?style=flat-square)](#)

A high-performance, multi-tenant property tax analytics and municipal verification SaaS platform designed for urban local bodies and smart city administrations across India. Engineered to support aggregated audits, validation backlogs, complex revenue collection monitoring, and context-aware conversational AI audits.

---

## 🏢 Platform Architecture

UPYOG consolidates records from **10 major Indian municipalities** (Delhi, Mumbai, Pune, Bengaluru, Chennai, Hyderabad, Ahmedabad, Kolkata, Jaipur, Lucknow) into a singular, responsive executive workspace. The system facilitates multi-tenant data partitioning, global query filtering, and granular ward audits.

### Key Workspaces & Modules
1. **Interactive Dashboard**: Consolidated financial and operational overview featuring animated counters, sparklines, status donut charts, and live activity streams.
2. **Advanced Analytics Page**: A grid containing **8 advanced charts** built using Recharts (gradient collections, approval/rejection series, vertical pending backlogs, stacked ward allocations, area trends, custom revenue heatmaps, and custom animated rate bars).
3. **Municipality Benchmarks**: Comparative matrix featuring side-by-side benchmarking profiles and dynamic Radar Charts.
4. **UPYOG AI Assistant**: Contextual natural language chatbot integrated with Google Gemini 1.5 Flash to answer data audits and municipal queries on the fly.
5. **Ledger & Audit Reports**: Instant client-side CSV downloads for complete municipal audit sheets, financial metrics, compliance backlogs, or executive brief txt formats.
6. **System Settings**: Theme styling toggle, active API integration status, default data format rules, and notifications controls.

---

## 🛠️ Technology Stack

- **Core**: React 19 + TypeScript + Vite + React Router DOM
- **Styling & UI**: Tailwind CSS v4.0 + Framer Motion (animated layouts/transitions) + Lucide Icons
- **State Management**: Zustand (lightweight global store)
- **Data Visualizations**: Recharts (dynamic responsive charts)
- **Utilities**: date-fns (relative/absolute dates) + clsx / tailwind-merge
- **Feedback & Notifications**: react-hot-toast (slick toast alerts)
- **Cognitive Engine**: Google Generative AI SDK (Gemini 1.5 Flash Integration)
- **SEO & Layout**: Semantic HTML5 markup + Responsive layout shifts

---

## 🏗️ Folder Structure

```text
src/
├── ai/
│   ├── context.ts       # Platform analytical context serializer
│   └── gemini.ts        # Google Gemini AI SDK client
├── components/
│   ├── charts/          # 8 Advanced Recharts & custom grid chart components
│   ├── dashboard/       # KPI grids, modal systems, and activity feeds
│   ├── navigation/      # Sidebar drawers, collapsing top bar, mobile drawer
│   └── ui/              # Reusable form elements and components
├── constants/
│   ├── cities.ts        # Color hex maps, gradients, and structural types
│   └── navigation.ts    # Sidebar route schemes and suggested prompts
├── data/
│   └── properties.json  # 1000 detailed property records across 10 cities
├── hooks/
│   ├── useAnalytics.ts  # Memoized analytics aggregator hook
│   └── useAnimatedCounter.ts # High performance RAF easing numbers hook
├── layouts/
│   └── DashboardLayout.tsx # Responsive wrapper shell
├── lib/
│   └── utils.ts         # INR currency, compact formatting, and general helpers
├── pages/
│   ├── DashboardPage.tsx
│   ├── AnalyticsPage.tsx
│   ├── CityInsightsPage.tsx
│   ├── AIAssistantPage.tsx
│   ├── ReportsPage.tsx
│   └── SettingsPage.tsx
├── store/
│   ├── usePropertyStore.ts # Zustand global property state (with filters)
│   ├── useThemeStore.ts    # Zustand dark/light theme state
│   └── useUIStore.ts       # Zustand sidebar & notification states
├── App.tsx              # Lazy loaded routing shell
├── index.css            # Custom CSS vars, scrollbars, and Tailwind configuration
└── main.tsx             # DOM entry point
```

---

## 🚀 Setup & Installation Guide

### Prerequisites
- Node.js **v20+**
- npm **v10+**

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Kunjalb29/UPYOG.git
cd UPYOG
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```
Open `.env` and configure your Gemini API Key:
```text
VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
```
> Get a free API Key from [Google AI Studio](https://aistudio.google.com/apikey).

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

---

## 🔒 License & Authorization

This dashboard is built as an authorized municipal analytical platform for smart city administrations under the UPYOG platform framework. Confidential property records are populated locally using standard multi-tenant datasets.
