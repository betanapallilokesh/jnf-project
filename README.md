<div align="center">
  <h1>JNF Portal</h1>
  <p>
    <strong>A Comprehensive Full-Stack Campus Recruitment System</strong>
  </p>
  <p>
    <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Laravel-11.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel" />
    <img src="https://img.shields.io/badge/MySQL-8.x-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
    <img src="https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
  </p>
</div>

## 📖 About the Project

The Job Notification Facility (JNF) Portal is an end-to-end digitised recruitment system designed to streamline the campus placement workflow. It bridges the gap between recruiters, placement administrators, and candidates by offering a seamless interface to submit job details, manage approvals, and track recruitment progress.

A standout feature of this system is its integration with **Google Gemini 2.5 Flash**, which powers an AI-assisted parsing engine that can instantly extract structured data from uploaded Job Description (JD) PDFs, drastically reducing manual data entry for recruiters.

## 🚀 The Stack

This repository is organized into a mono-repo structure containing both the frontend and backend applications.

### [Frontend Environment (Next.js)](./frontend)
*A highly performant, server-side rendered frontend built for scalability and a premium user experience.*
- **Core**: Next.js 15 (App Router), React 19, TypeScript
- **UI/UX**: Material-UI (MUI v7), Emotion
- **Auth**: NextAuth.js (Custom Credential Provider)
- **Architecture**: Feature-driven module design

### [Backend Environment (Laravel)](./backend)
*A robust, service-oriented RESTful API ensuring data integrity, security, and complex business logic execution.*
- **Core**: Laravel 11.x (PHP 8.2)
- **Database**: MySQL 8.x
- **Auth**: Laravel Sanctum (Token-based API authentication)
- **AI Integration**: Google Gemini REST API

## 📂 Project Structure

```text
jnf-project/
├── frontend/         # Next.js Application
│   ├── src/app/      # Next.js route configurations
│   ├── src/features/ # Feature-based UI components and logic
│   └── README.md     # Frontend-specific documentation
│
├── backend/          # Laravel RESTful API
│   ├── app/          # Controllers, Models, and Services
│   ├── routes/       # API endpoints definition
│   └── README.md     # Backend-specific documentation and ER diagrams
│
└── docs/             # Global project documentation and specs
```

## ⚙️ Getting Started

Before diving into the code, please ensure you review the core documentation to understand the business requirements and team workflows.

1. **Read the Specification**: Review `docs/jnf-portal-spec.md` to understand the domain and business rules.
2. **Team Setup**: Check `TEAM_SETUP.md` for our version control workflow, Git conventions, and branching strategies.

### Running Locally

Each environment runs independently. Please refer to their respective README files for detailed setup instructions:
- 👉 **[Frontend Setup Instructions](./frontend/README.md)**
- 👉 **[Backend Setup Instructions](./backend/README.md)**

## ✨ Key Technical Highlights

- **Decoupled Architecture**: Complete separation of concerns between the Next.js presentation layer and the Laravel API.
- **AI Parsing Engine**: Multimodal LLM integration capable of reading unstructured PDFs and returning structured JSON data.
- **Secure Authentication**: OTP-based recruiter registration coupled with Sanctum token validation for API protection.
- **Strict Data Integrity**: Comprehensive use of foreign-key constraints, cascading deletes, and complex pivot tables to model campus placements accurately.
