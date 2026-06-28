<div align="center">
  <h1>JNF Portal - Frontend</h1>
  <p>
    A scalable, modern frontend application for the Job Notification Facility (JNF) Portal.
  </p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/MUI-7-007FFF?style=for-the-badge&logo=mui" alt="MUI" />
  </p>
</div>

## 📖 About the Project

The JNF Portal Frontend is a highly performant, server-side rendered application built to serve candidates, recruiters, and administrators. It interfaces with a RESTful Laravel backend to deliver a seamless job notification and management experience.

Built with a focus on **scalability**, **maintainability**, and **developer experience**, the architecture leverages Next.js App Router and a feature-driven directory structure.

## 🚀 Tech Stack

- **Core**: Next.js 15 (App Router), React 19
- **Language**: TypeScript
- **Styling & UI**: Material-UI (MUI v7), Emotion
- **Authentication**: NextAuth.js
- **Tooling**: ESLint

## 🏗️ Architecture

We utilize a **Feature-Driven Architecture** to ensure the codebase remains maintainable as business complexity grows. Code is co-located by business domain rather than technical function.

```text
src/
├── app/          # Next.js App Router (Layouts & Route definitions only)
├── features/     # Business logic modules (UI, data fetching, hooks per feature)
├── components/   # Shared, generic UI components (Buttons, Inputs, Modals)
├── lib/          # Cross-feature utilities and helper functions
├── providers/    # Global Context and state providers
├── theme/        # MUI global theme configurations
└── types/        # Global TypeScript definitions
```

### Route Surfaces
- `(public)`: Public-facing landing pages, authentication, and registration flows.
- `(recruiter)`: Dedicated dashboards and management tools for recruiters.
- `(admin)`: Administrative control panel and system settings.

## ⚙️ Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd jnf-project/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Copy the example environment file and configure your local variables.
   ```bash
   cp .env.example .env.local
   ```
   *Note: Ensure your environment variables point to your local Laravel backend instance.*

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at [http://localhost:3000](http://localhost:3000).

## 🛡️ Best Practices & Guidelines

To maintain code quality across the team, please adhere to the following rules:

1. **Feature Encapsulation**: Do not place business-specific code in shared folders. If a component or hook belongs to a specific domain, it lives in `src/features/<domain>`.
2. **Thin Routes**: Route files in `src/app` should act only as wrappers that import and render entry components from `src/features`. Do not build massive UI trees directly in `page.tsx`.
3. **Type Safety**: Strictly define interfaces for API responses and component props. Avoid the use of `any`.
4. **Code Quality**: Ensure `npm run lint` passes before pushing changes.
