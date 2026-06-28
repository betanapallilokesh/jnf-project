<div align="center">
  <h1>JNF Portal — Backend Technical Documentation</h1>
  <p>
    <strong>Digitising the campus placement recruitment workflow with AI-assisted parsing.</strong>
  </p>
  <p>
    <img src="https://img.shields.io/badge/Laravel-11.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel" />
    <img src="https://img.shields.io/badge/PHP-8.2-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP" />
    <img src="https://img.shields.io/badge/MySQL-8.x-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
    <img src="https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
  </p>
</div>

> **Project:** Job Notification Form (JNF) Portal for IIT (ISM) Dhanbad  
> **Purpose:** Digitises the campus placement recruitment workflow — from recruiter registration and company onboarding through JNF creation, AI-assisted form filling, admin review, and approval.

---

## Table of Contents

1. [Technology Stack](#1-technology-stack)
2. [Architecture Overview](#2-architecture-overview)
3. [Database Design](#3-database-design)
4. [Authentication System](#4-authentication-system)
5. [AI-Powered JD Parsing](#5-ai-powered-jd-parsing-gemini)
6. [API Route Structure](#6-api-route-structure)
7. [Seeders & Initial Data](#7-seeders--initial-data)
8. [Environment Variables & Keys](#8-environment-variables--keys)
9. [Common Commands](#9-common-commands)
10. [Viva Q&A — Likely Questions & Answers](#10-viva-qa--likely-questions--answers)

---

## 1. Technology Stack

| Layer | Technology | Version | Why? |
|---|---|---|---|
| **Backend Framework** | Laravel (PHP) | 11.x | Laravel is the most popular PHP framework; provides Eloquent ORM, migrations, Sanctum auth, queue system, and artisan CLI out-of-the-box. |
| **Database** | MySQL | 8.x | Relational database ideal for structured JNF data with foreign key constraints, enum columns, and complex joins. |
| **Authentication** | Laravel Sanctum | — | Provides lightweight token-based API authentication (SPA + mobile friendly), without the overhead of OAuth2/Passport. |
| **AI / GenAI** | Google Gemini 2.5 Flash | REST API | Multimodal LLM capable of reading PDFs directly (via base64 inline data) and extracting structured JSON. Used for auto-filling JNF forms from uploaded Job Description PDFs. |
| **Email** | Laravel Mail (SMTP/Log) | — | Sends OTP verification emails during recruiter registration. Uses `log` driver in development. |
| **Frontend** | Next.js + React + MUI | 14.x | *(Separate repo folder)* — consumes the Laravel API via Sanctum tokens. |

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                │
│   React + MUI  ·  Sanctum Token in Authorization    │
└──────────────────────┬──────────────────────────────┘
                       │  HTTP/JSON (REST API)
                       ▼
┌─────────────────────────────────────────────────────┐
│               Laravel Backend (PHP 8.2+)            │
│                                                     │
│  ┌────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │  Routes     │  │ Controllers  │  │ Middleware   │ │
│  │  (auth,jnf) │→ │ (API layer)  │→ │ (Sanctum,   │ │
│  └────────────┘  └──────┬───────┘  │  recruiter)  │ │
│                         │          └─────────────┘ │
│                         ▼                           │
│              ┌──────────────────┐                   │
│              │   Services       │                   │
│              │  • RecruiterAuth │                   │
│              │  • OtpService    │                   │
│              │  • JnfAiService  │──→ Gemini API     │
│              └────────┬─────────┘                   │
│                       │                             │
│                       ▼                             │
│              ┌──────────────────┐                   │
│              │  Eloquent Models │                   │
│              │  (21 models)     │                   │
│              └────────┬─────────┘                   │
│                       │                             │
└───────────────────────┼─────────────────────────────┘
                        │  Eloquent ORM
                        ▼
               ┌────────────────┐
               │   MySQL 8.x    │
               │  (jnf_portal)  │
               └────────────────┘
```

**Design Pattern:** The project follows a **Service-Repository pattern** where:
- **Controllers** handle HTTP request/response only (thin controllers).
- **Services** contain all business logic (e.g., `RecruiterAuthService`, `JnfAiService`).
- **Models** define relationships and casts via Eloquent ORM.

---

## 3. Database Design

### 3.1 Migration Execution Order

Migrations run in **strict chronological order**. The numbered prefix (`000001`, `000002`, …) ensures foreign key dependencies are satisfied:

| # | Migration File | Tables Created |
|---|---|---|
| 1 | `create_framework_tables` | `sessions`, `cache`, `cache_locks`, `jobs`, `job_batches`, `failed_jobs`, `password_reset_tokens`, `personal_access_tokens` |
| 2 | `create_company_and_master_tables` | `companies`, `industry_tags`, `company_industry_tags`, `programmes`, `disciplines`, `skills` |
| 3 | `create_auth_and_user_tables` | `admins`, `recruiters`, `recruiter_otps` |
| 4 | `create_jnf_core_tables` | `jnfs`, `jnf_contacts`, `jnf_skills`, `jnf_eligibility_rules`, `jnf_eligibility_programmes`, `jnf_eligibility_disciplines` |
| 5 | `create_jnf_details_tables` | `jnf_salary_packages`, `jnf_salary_components`, `jnf_selection_rounds`, `jnf_declarations`, `jnf_documents`, `jnf_audit_logs` |
| 6 | `create_portal_content_tables` | `portal_quick_links`, `portal_stats` |
| 7+ | Incremental patches | `departments`, discipline decoupling, additional JNF columns, salary fields, eligibility fields, file paths |

### 3.2 Entity Relationship Diagram (ER Summary)

```
companies ──1:N──→ recruiters
companies ──1:N──→ jnfs
recruiters ──1:N──→ jnfs (created_by)
admins ──1:N──→ jnfs (reviewed_by)

jnfs ──1:N──→ jnf_contacts
jnfs ──1:N──→ jnf_salary_packages ──1:N──→ jnf_salary_components
jnfs ──1:N──→ jnf_selection_rounds
jnfs ──1:1──→ jnf_eligibility_rules
jnfs ──1:1──→ jnf_declarations
jnfs ──1:N──→ jnf_documents
jnfs ──1:N──→ jnf_audit_logs

jnfs ──M:N──→ skills           (pivot: jnf_skills)
jnfs ──M:N──→ programmes       (pivot: jnf_eligibility_programmes)
jnfs ──M:N──→ disciplines      (pivot: jnf_eligibility_disciplines)

companies ──M:N──→ industry_tags (pivot: company_industry_tags)
```

### 3.3 Key Tables Explained

#### `companies`
Stores recruiter company profiles: name, website, sector, HQ location, annual turnover, employee count, MNC flag, etc. Created during recruiter registration.

#### `recruiters`
Each recruiter belongs to one company (`company_id` FK). Stores credentials (bcrypt-hashed password), OTP-verified email, and a status enum (`pending → active → blocked`).

#### `admins`
CDC/Placement Office staff. Simple email + password auth. Has a `status` field (`active`/`inactive`).

#### `jnfs` (Job Notification Forms)
**The central table.** Each JNF record tracks:
- **Who:** `company_id`, `created_by` (recruiter), `reviewed_by` (admin)
- **What:** `job_title`, `job_designation`, `work_location_mode` (enum: on_site/remote/hybrid)
- **Status lifecycle:** `draft → submitted → under_review → changes_requested → approved → closed`
- **Documents:** `jd_pdf_path`, `brochure_path`

#### `jnf_eligibility_rules`
One-to-one with `jnfs`. Defines minimum CGPA, backlog policy, gender filter, PhD requirements.

#### `jnf_salary_packages` / `jnf_salary_components`
Package stores CTC, base salary, gross, take-home, stocks, bond. Components store line-item bonuses (joining, retention, relocation, etc.).

#### `jnf_selection_rounds`
Captures each hiring round: category (PPT, written test, interview…), mode (online/offline/hybrid), duration, order.

#### `jnf_declarations`
Stores signatory name, designation, declaration date, typed signature, and boolean consent flags (AIPC guidelines, accuracy terms, RTI/NIRF consent).

#### `jnf_audit_logs`
Immutable append-only log. Tracks every state change with `old_values_json` / `new_values_json` diffs and actor metadata.

### 3.4 Important Database Concepts Used

| Concept | Where Used | Why |
|---|---|---|
| **Foreign Keys with Cascading Deletes** | All child tables (e.g., `jnf_contacts.jnf_id`) | Automatically cleans up child rows when a parent JNF is deleted — ensures referential integrity. |
| **Enum Columns** | `jnfs.status`, `recruiters.status`, `jnf_contacts.contact_type` | Restricts column values at the database level, preventing invalid data. |
| **Pivot Tables (M:N)** | `jnf_skills`, `jnf_eligibility_programmes`, `company_industry_tags` | Implements many-to-many relationships. Laravel's `belongsToMany()` uses these. |
| **Unique Constraints** | `programmes.code`, `recruiters.email`, `skills.name` | Prevents duplicate entries at the DB level — faster and safer than application-level checks. |
| **Nullable Foreign Keys** | `jnfs.reviewed_by` | A JNF may not have been reviewed yet, so the admin FK is nullable. Uses `onDelete('set null')`. |
| **Decimal Precision** | `jnf_salary_packages.ctc_annual DECIMAL(18,2)` | Financial values need exact precision — floats would cause rounding errors. |
| **Indexed Columns** | `jnfs.status`, `jnfs.recruitment_season`, `recruiters.status` | Speeds up WHERE clause queries on frequently filtered columns. |
| **PHP Backed Enums** | `JnfStatus`, `RecruiterStatus` | Type-safe enums in PHP 8.1+ that are cast directly in Eloquent models via `$casts`. |

---

## 4. Authentication System

### 4.1 How Sanctum Works

Laravel Sanctum provides **API token authentication**:

1. Recruiter logs in with `email` + `password`.
2. Backend verifies credentials, creates a `personal_access_tokens` row, returns a plaintext token.
3. Frontend stores this token and sends it as `Authorization: Bearer <token>` on every API request.
4. Sanctum middleware (`auth:sanctum`) validates the token on each request.

**Why Sanctum over Passport?**  
Passport implements full OAuth2 (client IDs, scopes, refresh tokens) — overkill for a single SPA. Sanctum is simpler, lighter, and designed for first-party SPAs.

### 4.2 Registration Flow (OTP-Based)

```
Recruiter                  Backend                         Email
   │                          │                              │
   ├── POST /auth/send-otp ──→│                              │
   │                          ├── Generate 6-digit OTP ──────→│
   │                          ├── Store in recruiter_otps     │
   │                          │   (expires_at = now + 10min)  │
   │                          │                              │
   │◄── { expires_in: 10 } ──┤                              │
   │                          │                              │
   ├── POST /auth/verify-otp →│                              │
   │   { email, otp_code }    ├── Check code + expiry        │
   │                          ├── Set verified_at = now()     │
   │◄── { verified: true } ──┤                              │
   │                          │                              │
   ├── POST /auth/register ──→│                              │
   │   { email, password,     ├── Check verified OTP exists  │
   │     company: {...},      ├── Create Company (or find)   │
   │     full_name }          ├── Create Recruiter           │
   │                          ├── Delete OTP (single-use)    │
   │◄── { recruiter, company }┤                              │
```

**Key security decisions:**
- OTP is rate-limited: 1 per minute per email.
- OTP auto-expires after 10 minutes.
- OTP is single-use: deleted after successful registration.
- Passwords are hashed with `bcrypt` via `Hash::make()`.

### 4.3 Login Flow

```
POST /api/auth/login  →  { email, password }
                      →  Hash::check(password, recruiter.password)
                      →  Check recruiter.status === 'active'
                      →  createToken('recruiter-auth-token')
                      →  Return { recruiter, token, token_type: 'Bearer' }
```

---

## 5. AI-Powered JD Parsing (Gemini)

### 5.1 What It Does

When a recruiter uploads a **Job Description PDF**, the system uses **Google Gemini 2.5 Flash** (a multimodal LLM) to automatically extract structured data from the PDF and pre-fill the JNF form fields.

### 5.2 How It Works — Step by Step

```
Recruiter (Browser)                Laravel Backend                    Google Gemini API
       │                                │                                    │
       ├── POST /api/jnfs/import-jd ───→│                                    │
       │   (multipart: jd_pdf file)     │                                    │
       │                                ├── Validate (PDF, ≤10MB)            │
       │                                ├── base64_encode(file contents)     │
       │                                ├── Build prompt + inline_data ──────→│
       │                                │                                    │
       │                                │   ┌─ Gemini processes PDF ───────┐ │
       │                                │   │  • OCR / text extraction     │ │
       │                                │   │  • NLP-based field mapping   │ │
       │                                │   │  • JSON structured output    │ │
       │                                │   └──────────────────────────────┘ │
       │                                │                                    │
       │                                │◄── JSON response ─────────────────┤
       │                                ├── Clean markdown fences            │
       │                                ├── json_decode                      │
       │◄── { data: { job_title, ... }} ┤                                    │
       │                                │                                    │
       ├── Auto-fill form fields ──────→│                                    │
```

### 5.3 The Prompt Engineering

The prompt in `JnfAiService.php` is carefully engineered:

```
"You are a precise HR data extraction assistant.
Extract the required job details from the provided Job Description (JD) PDF.
Return ONLY valid JSON data matching the structure below.
If a value is not mentioned in the text, use null."
```

**Schema requested from the LLM:**

| Key | Type | Maps To |
|---|---|---|
| `job_title` | string | `jnfs.job_title` |
| `job_designation` | string \| null | `jnfs.job_designation` |
| `place_of_posting` | string \| null | `jnfs.place_of_posting` |
| `work_location_mode` | `on_site` \| `remote` \| `hybrid` \| null | `jnfs.work_location_mode` |
| `expected_hires` | integer \| null | `jnfs.expected_hires` |
| `minimum_hires` | integer \| null | `jnfs.minimum_hires` |
| `tentative_joining_month` | `YYYY-MM-DD` \| null | `jnfs.tentative_joining_month` |
| `ctc_annual` | number \| null | `jnf_salary_packages.ctc_annual` |
| `base_fixed` | number \| null | `jnf_salary_packages.base_fixed` |
| `minimum_cgpa` | number \| null | `jnf_eligibility_rules.minimum_cgpa` |

### 5.4 Key Technical Details

| Aspect | Detail |
|---|---|
| **API Endpoint** | `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent` |
| **Auth Method** | API key passed as query parameter (`?key=...`) |
| **Input Format** | Multimodal: text prompt + base64-encoded PDF as `inline_data` |
| **Output Format** | Forced JSON via `generationConfig.response_mime_type = 'application/json'` |
| **Timeout** | 60 seconds (`Http::timeout(60)`) |
| **Fallback** | Regex strips markdown code fences (` ```json `) in case the model wraps JSON anyway |
| **Error Handling** | `try/catch` returns 500 with `error` message if Gemini fails or JSON is malformed |

### 5.5 Why Gemini?

1. **Multimodal capability** — Can directly read PDFs (images + text) without a separate OCR step.
2. **Structured output mode** — `response_mime_type: 'application/json'` guarantees JSON output, not free-form text.
3. **Cost-effective** — Gemini Flash is optimised for speed and low cost vs. GPT-4 or Claude.
4. **Google ecosystem** — Simple API key auth, no OAuth token dance required.

---

## 6. API Route Structure

### Auth Routes (`routes/auth.php`)

| Method | URI | Controller | Auth? | Purpose |
|---|---|---|---|---|
| POST | `/api/auth/send-otp` | `AuthController@sendOtp` | No | Send 6-digit OTP to email |
| POST | `/api/auth/verify-otp` | `AuthController@verifyOtp` | No | Verify OTP code |
| POST | `/api/auth/register` | `AuthController@register` | No | Register recruiter + company |
| POST | `/api/auth/login` | `AuthController@login` | No | Login, get Bearer token |
| GET | `/api/auth/me` | `AuthController@me` | Yes | Get current user profile |
| POST | `/api/auth/logout` | `AuthController@logout` | Yes | Revoke token |

### JNF Routes (`routes/jnfs.php`) — All require `auth:sanctum`

| Method | URI | Purpose |
|---|---|---|
| POST | `/api/jnfs/import-jd` | **AI parsing** — upload JD PDF, get extracted data |
| POST | `/api/jnfs/upload-jd-pdf` | Upload JD PDF file (file storage only) |
| GET | `/api/jnfs` | List all JNFs for current recruiter |
| POST | `/api/jnfs` | Create new JNF (draft) |
| GET | `/api/jnfs/{id}` | Get single JNF with all relations |
| PUT | `/api/jnfs/{id}` | Update JNF fields |
| DELETE | `/api/jnfs/{id}` | Delete JNF |
| POST | `/api/jnfs/{id}/preview` | Mark preview as complete |
| POST | `/api/jnfs/{id}/submit` | Submit JNF for review |
| POST/GET/PUT/DELETE | `/api/jnfs/{id}/contacts` | CRUD for JNF contacts |
| GET/PUT | `/api/jnfs/{id}/eligibility` | Read/upsert eligibility rules |
| GET/PUT | `/api/jnfs/{id}/salary` | Read/upsert salary package |
| POST/GET/PUT/DELETE | `/api/jnfs/{id}/rounds` | CRUD for selection rounds |
| GET/PUT | `/api/jnfs/{id}/declaration` | Read/upsert declaration |
| POST/GET/DELETE | `/api/jnfs/{id}/documents` | File uploads and listing |

---

## 7. Seeders & Initial Data

### Execution Order

```php
// DatabaseSeeder.php
$this->call([
    MasterDataSeeder::class,     // Lookup tables
    PortalContentSeeder::class,  // Landing page content
    AdminSeeder::class,          // Default admin accounts
]);
```

### MasterDataSeeder

Seeds the following lookup/reference tables:

| Table | Sample Data |
|---|---|
| `programmes` | B.Tech (UG, 4yr, JEE Advanced), M.Tech (PG, 2yr, GATE), PhD (Doctoral, 5yr) |
| `disciplines` | CSE, EE, ME, AI |
| `skills` | Python, Java, C++, Machine Learning, Web Development |
| `industry_tags` | Software/IT, Finance/FinTech, Consulting, Core Engineering, R&D |

### AdminSeeder

Uses `updateOrCreate` (idempotent — safe to run multiple times):

| Email | Name | Role |
|---|---|---|
| `admin@iitism.ac.in` | CDC Admin | Placement Coordinator |
| `deepakmarudi1@gmail.com` | Deepak Admin | System Administrator |

**Important:** Passwords are **bcrypt hashed** using `Hash::make()`. Raw passwords are only written in the seeder for initial setup.

---

## 8. Environment Variables & Keys

### Critical `.env` Variables

| Variable | Purpose | Example Value |
|---|---|---|
| `DB_DATABASE` | MySQL database name | `jnf_portal` |
| `DB_USERNAME` / `DB_PASSWORD` | MySQL credentials | `root` / *(empty for local)* |
| `FRONTEND_URL` | CORS origin for the React frontend | `http://localhost:3000` |
| `SANCTUM_STATEFUL_DOMAINS` | Domains allowed for cookie-based auth | `localhost:3000,127.0.0.1:3000` |
| `SESSION_DOMAIN` | Cookie domain | `localhost` |
| `GEMINI_API_KEY` | **Google Gemini API key** for AI parsing | `AIzaSy...` |
| `MAIL_MAILER` | Email transport | `log` (dev) / `smtp` (prod) |
| `QUEUE_CONNECTION` | Job queue driver | `database` |

### How to Get a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Click **"Create API Key"**
3. Copy the key and paste it as `GEMINI_API_KEY` in your `.env`

### Config Binding (`config/services.php`)

```php
return [
    'gemini' => [
        'api_key' => env('GEMINI_API_KEY'),
    ],
];
```

This is accessed in code as `config('services.gemini.api_key')`.  
**Why not use `env()` directly in service classes?**  
Laravel caches config in production (`php artisan config:cache`). After caching, `env()` returns null — only `config()` works. This is a Laravel best practice.

---

## 9. Common Commands

```bash
# Run all migrations from scratch + seed data
php artisan migrate:fresh --seed

# Run only seeders (without dropping tables)
php artisan db:seed

# Run a specific seeder
php artisan db:seed --class=AdminSeeder

# Start the development server
php artisan serve

# Clear all caches
php artisan config:clear && php artisan cache:clear && php artisan route:clear

# List all registered routes
php artisan route:list --path=api
```

---

## 10. Viva Q&A — Likely Questions & Answers

### Database & Migrations

**Q: What is a migration in Laravel?**  
A: A migration is a version-controlled PHP file that defines database schema changes (create table, add column, etc.). It allows the team to reproduce the exact database structure by running `php artisan migrate`.

**Q: Why use migrations instead of raw SQL?**  
A: Migrations are database-agnostic (work with MySQL, PostgreSQL, SQLite), version-controlled in Git, and reversible via `down()` methods. Raw SQL is not portable and cannot be tracked.

**Q: What does `foreignId('company_id')->constrained()->onDelete('cascade')` do?**  
A: It creates an unsigned big integer column `company_id`, adds a foreign key constraint to `companies.id`, and automatically deletes all child rows when the parent company is deleted.

**Q: What is the difference between `1:1`, `1:N`, and `M:N` relationships?**  
A: 
- `1:1` (hasOne): One JNF has one declaration (`jnf_declarations`). 
- `1:N` (hasMany): One JNF has many contacts (`jnf_contacts`).
- `M:N` (belongsToMany): One JNF can require many skills, and one skill can be required by many JNFs (`jnf_skills` pivot table).

**Q: What is a pivot table?**  
A: A pivot table resolves a many-to-many relationship. It has two foreign keys (e.g., `jnf_id` and `skill_id`) and no standalone identity. Laravel calls them via `belongsToMany()`.

**Q: Why use `DECIMAL(18,2)` for salary instead of `FLOAT`?**  
A: `FLOAT` uses binary floating-point which causes rounding errors (e.g., 10.30 might store as 10.2999999). `DECIMAL` stores exact values — essential for financial data.

**Q: What is an Enum column and why use it?**  
A: An enum restricts a column to a fixed set of values (e.g., `draft`, `submitted`, `approved`). It enforces data integrity at the database level. In Laravel, we also use PHP 8.1 backed enums (`JnfStatus::Draft`) for type safety in code.

**Q: What does `migrate:fresh --seed` do?**  
A: It **drops all tables**, re-runs all migrations from scratch, then executes all seeders. Useful in development for a clean slate. **Never run in production** — it destroys all data.

---

### Authentication

**Q: What is Laravel Sanctum?**  
A: Sanctum is a lightweight authentication package for SPAs and mobile apps. It issues API tokens stored in `personal_access_tokens` table. Unlike Passport (full OAuth2), Sanctum is simpler and designed for first-party apps.

**Q: How does OTP verification work?**  
A: 
1. User requests OTP → 6-digit code generated + stored in `recruiter_otps` with 10-min expiry.
2. User submits OTP → system checks code match + expiry → marks `verified_at`.
3. On registration → system checks verified OTP exists → creates account → deletes OTP (single-use).

**Q: Why hash passwords with bcrypt?**  
A: Bcrypt is a one-way hash — you cannot reverse it to get the original password. Even if the database is compromised, passwords are safe. `Hash::check()` compares by re-hashing the input.

**Q: What is the `auth:sanctum` middleware?**  
A: It intercepts every request, reads the `Authorization: Bearer <token>` header, looks up the token in the `personal_access_tokens` table, and attaches the authenticated user to the request. If the token is invalid/missing, it returns 401 Unauthorized.

---

### AI Parsing (Gemini)

**Q: Why use an AI model for parsing JD PDFs?**  
A: Job descriptions have no standard format — every company writes them differently. Rule-based parsing (regex) would fail on unseen layouts. An LLM generalises across all formats because it understands natural language context.

**Q: How does Gemini process a PDF?**  
A: The PDF is base64-encoded and sent as `inline_data` in the API request body alongside a text prompt. Gemini's multimodal architecture can read both the text layer and the visual layout of the PDF, extracting meaning from tables, bullet points, and headers.

**Q: What is `response_mime_type: 'application/json'`?**  
A: This is a Gemini generation config parameter that forces the model to output valid JSON only — no preamble, no explanations, no markdown. This eliminates the need for complex output parsing.

**Q: What happens if Gemini returns invalid JSON?**  
A: The code has a fallback: it strips markdown code fences (` ```json `) using regex. Then `json_decode` is called. If it still fails, an exception is thrown and the frontend receives a 500 error with a descriptive message.

**Q: Why is the API key stored in `.env` and not hardcoded?**  
A: Security best practice. `.env` is in `.gitignore` so it never enters version control. Different environments (dev, staging, prod) can have different keys. Hardcoding secrets in source code is a security vulnerability.

**Q: What is the difference between `env()` and `config()`?**  
A: `env()` reads directly from the `.env` file. `config()` reads from the cached config array. In production, after `php artisan config:cache`, `env()` returns `null` — so services must always use `config()`.

**Q: What is prompt engineering?**  
A: It's the practice of carefully crafting the text instruction sent to an LLM to get the desired output format and accuracy. Our prompt specifies exact JSON key names, data types, and a fallback value (`null`) for missing fields.

---

### Laravel Concepts

**Q: What is Eloquent ORM?**  
A: Eloquent is Laravel's Active Record implementation. Each database table has a corresponding Model class. Instead of writing SQL, you use methods like `Jnf::where('status', 'draft')->get()`.

**Q: What is the Service pattern and why use it?**  
A: Business logic is extracted into dedicated Service classes (e.g., `JnfAiService`, `RecruiterAuthService`). This keeps Controllers thin (only HTTP concerns), makes logic reusable and testable, and follows Single Responsibility Principle (SRP).

**Q: What is `$fillable` in a model?**  
A: It's a whitelist of columns that can be mass-assigned (e.g., via `Jnf::create([...])` or `$jnf->fill([...])`). This prevents **mass assignment vulnerabilities** where an attacker could inject values for sensitive columns like `status` or `reviewed_by`.

**Q: What are `$casts` in a model?**  
A: Casts automatically convert database values to PHP types when reading. For example, `'status' => JnfStatus::class` means `$jnf->status` returns a PHP enum object, not a raw string. Other examples: `'boolean'`, `'datetime'`, `'array'`.

**Q: What does `updateOrCreate` do?**  
A: It searches for a record matching the first array (e.g., `['email' => 'admin@iitism.ac.in']`). If found, it updates with the second array. If not found, it creates a new record with both arrays merged. This makes seeders **idempotent** — safe to run multiple times.

---

### General / Architecture

**Q: What is CORS and why is `FRONTEND_URL` needed?**  
A: CORS (Cross-Origin Resource Sharing) is a browser security mechanism. Since the frontend (`localhost:3000`) and backend (`localhost:8000`) are on different origins, the browser blocks API requests unless the backend explicitly allows the frontend's origin.

**Q: What is a REST API?**  
A: REST (Representational State Transfer) uses standard HTTP methods: GET (read), POST (create), PUT (update), DELETE (remove). Resources are addressed by URLs (e.g., `/api/jnfs/5`). Responses are JSON.

**Q: What is the JNF lifecycle?**  
A: `draft` → recruiter fills form → `submitted` → admin reviews → `under_review` → admin may request changes → `changes_requested` → recruiter fixes → resubmitted → `approved` (or `closed`).

**Q: Why separate `jnf_salary_packages` from `jnf_salary_components`?**  
A: A salary package is the overall structure (CTC, base, gross). Components are individual add-ons (joining bonus, relocation allowance). This normalised design avoids cramming 15+ nullable columns into one table and supports dynamic addition of bonus types.
