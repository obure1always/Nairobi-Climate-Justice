# Climate Justice Nairobi

An offline-first educational web application and backend service designed to teach youth in Nairobi, Kenya, about climate adaptation, local environmental risks, and civic participation.

## 1. Project Overview

### Problem Statement
Youth residing in Nairobi's informal and low-income urban settlements—including Kibera, Ruaraka, and Mathare—face severe and compounding environmental challenges:
- Urban Heat Island (UHI) effects driven by high structural density, corrugated iron roofing, asphalt roads, and scarce tree canopy.
- Severe flash flooding during intense rainfall seasons caused by inadequate civil drainage networks and clogged stormwater channels.
- Water contamination and sanitation failures when floodwaters inundate latrines, triggering recurrent outbreaks of waterborne diseases.
- High cellular data expenses, intermittent internet connectivity, and low-to-mid-tier Android smartphones that hinder access to digital learning resources.
- Commercial greenwashing and information asymmetry, alongside limited awareness of constitutional and county-level avenues for civic engagement.

### Intended Users
- Youth aged 15 to 24 living in Nairobi's urban settlements.
- Grassroots community organizers and youth climate groups in informal settlements.
- Students and educators seeking localized environmental curricula aligned with Kenyan ecological realities.

### Project Scope and Implemented Functionality
The platform provides a mobile-first Progressive Web Application (PWA) supported by a lightweight Express.js backend and an SQLite relational database:
- **Bilingual Curriculum**: Seven structured educational modules available in English and Kiswahili:
  1. Nairobi Climate Risk (*Hatari ya Hali ya Hewa Nairobi*)
  2. Urban Flooding (*Mafuriko Mjini*)
  3. Heat and Health (*Joto na Afya*)
  4. Water Stress and Disease Prevention (*Uhaba wa Maji na Kuzuia Magonjwa*)
  5. Climate Justice (*Haki ya Hali ya Hewa*)
  6. Green Claims and Greenwashing (*Madai ya Kijani*)
  7. Safe Civic Participation (*Ushiriki Salama wa Kiraia*)
- **Interactive Learning Interface**: Lesson views with reading modes, downloadable study notes, local video clips, and audio narration controls.
- **Knowledge Assessments**: Formative quizzes, baseline and endline research questionnaires, and a System Usability Scale (SUS) instrument.
- **Climate Buddy Assistant**: A grounded tutor for curriculum queries supporting voice synthesis via the Web Speech API and optional cloud-based language model integration.
- **Global Audio Coordinator**: A singleton controller preventing overlapping audio between lesson narration, assistant speech, and video media.
- **Decision Scenarios and Community Guides**: Branching scenarios on adaptation decisions, community guides (sack farming, flood preparation, rainwater management), and an environmental terminology glossary.
- **Offline Persistence**: Client-side caching via Dexie.js (IndexedDB) and Workbox Service Workers, enabling full curriculum reading and quiz completion without an internet connection.
- **Dual Authentication**:
  - Email and password authentication with confirmation checks.
  - Kenyan phone-number-and-password authentication (`+254` formatting) operating independently without third-party SMS OTP gateways.
  - Password hashing utilizing Node.js native `scrypt` cryptography.
  - Session management via SQLite session records and 16-character account recovery codes.
- **Digital Certificates**: Generation and verification of verifiable course completion certificates with unique URLs (`/verify/:id`).
- **Protected Administrator Dashboard**: A restricted `/admin` console providing real-time audit views of registered users, module and lesson progress, certificates, and submissions directly from SQLite.

---

## 2. Technical Requirements

### Required Runtime and Tooling
- **Node.js**:
  - Minimum supported version: `18.0.0` or higher.
  - Tested development and build versions: Node.js `v22.x` and `v24.14.0`.
- **Package Manager**:
  - npm version `9.0.0` or higher (tested on npm `11.9.0`).
- **Operating System**:
  - OS-agnostic (tested on macOS Sonoma/Sequoia and Ubuntu Linux 22.04 LTS).

### Client Dependencies (Frontend)
- **Framework and UI**: React `19.2.8`, React DOM `19.2.8`, React Router DOM `7.18.4`.
- **Build Tool and Dev Server**: Vite `5.4.21`, TypeScript `~6.0.2`.
- **Styling**: Tailwind CSS `3.4.19`, PostCSS `8.5.28`, Autoprefixer `10.6.1`.
- **Icons and Animation**: Lucide React `1.48.0`, Framer Motion `11.18.2`.
- **Offline Data Layer**: Dexie `4.4.6`, Dexie React Hooks `4.4.0`.
- **Service Worker and PWA**: `vite-plugin-pwa` `1.3.0`.
- **Testing**: Vitest `4.1.11`, React Testing Library `16.3.3`, DOM Testing Library `10.4.2`, jsdom `27.0.1`.
- **Linting**: oxlint `1.81.0`.

### Server Dependencies (Backend)
- **Runtime and Framework**: Express.js `5.2.1`, Node.js native cryptographic modules (`crypto.scryptSync`).
- **Database Engine and ORM**: SQLite3 `6.0.1`, Sequelize `6.37.8`.
- **Optional Database Dialect**: pg `8.23.0` (for PostgreSQL deployments).
- **Environment and Utilities**: dotenv `18.0.4`, cors `2.8.6`.
- **Optional External Integrations**: `google-auth-library` `11.2.0` (Google OAuth token verification).
- **Development and Execution**: `tsx` `4.23.15`, TypeScript `5.9.3`.
- **Testing**: Jest `30.5.2`, ts-jest `29.4.14`, Supertest `7.3.0`, cross-env `10.1.0`.

---

## 3. Installation and Running Instructions

The application consists of two decoupled applications: the Express API backend (`server/`) and the React single-page frontend (`client/`). Both services must run concurrently during local development.

### Step 1: Clone the Repository
```bash
git clone https://github.com/obure1always/Nairobi-Climate-Justice.git
cd Nairobi-Climate-Justice
```

### Step 2: Configure and Start the Backend Service
The backend manages data persistence, authentication sessions, and curriculum records via SQLite.

1. Navigate to the server directory and install dependencies:
   ```bash
   cd server
   npm install
   ```

2. Create the environment configuration file:
   ```bash
   cp .env.example .env
   ```

3. Review the environment configuration in `server/.env`. Default placeholder values:
   ```ini
   PORT=3001
   NODE_ENV=development
   ALLOWED_ORIGIN=http://localhost:5173
   SQLITE_DB_PATH=./database.sqlite
   ADMIN_EXPORT_SECRET=replace_with_a_secure_random_64_character_hex_key

   # Optional external integrations (leave empty for default local behavior)
   GOOGLE_CLIENT_ID=
   GROQ_API_KEY=
   OPENAI_API_KEY=
   OPENAI_TTS_VOICE=nova
   ```

4. Database Initialization:
   The backend initializes the SQLite database automatically on startup. The `setupDb()` procedure executes Sequelize model synchronizations and database table adjustments, followed by `seedModules()` and `seedDemoAccounts()` to establish initial curriculum modules and roles. No manual SQL imports are required.

5. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend will start and listen on verified local address:
   `http://127.0.0.1:3001` (API root at `http://127.0.0.1:3001/` and health check at `http://127.0.0.1:3001/api/v1/health`).

### Step 3: Configure and Start the Frontend Service
The frontend is a React application configured to communicate with the local backend.

1. In a separate terminal window, navigate to the client directory and install dependencies:
   ```bash
   cd client
   npm install
   ```

2. Configure environment overrides if necessary:
   ```bash
   cp .env.example .env.local
   ```
   In local development, `client/vite.config.ts` proxies all relative `/api` calls directly to `http://127.0.0.1:3001`. If hosting frontend and backend on distinct domains, set:
   ```ini
   VITE_API_BASE_URL=http://127.0.0.1:3001
   VITE_GOOGLE_CLIENT_ID=
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at verified local address:
   `http://localhost:5173`

### Step 4: Administrator Setup and Access
The platform includes an administrative audit interface located at `/admin`:
- **Dashboard URL**: `http://localhost:5173/admin`
- **Backend API Endpoints**: `GET /api/v1/admin/dashboard` and `PATCH /api/v1/admin/users/:id/role`.
- **Database Persistence**: Connected directly to `server/database.sqlite`.
- **Authorization**:
  - Access is restricted strictly to authenticated accounts with `role: "admin"`.
  - Non-administrator requests receive an HTTP 403 Forbidden response.
  - Unauthenticated requests receive an HTTP 401 Unauthorized response.
  - Password hashes, password salts, and tokens are excluded from all admin responses.
- **Admin Access Method**:
  1. The server seeds an initial administrator user (`admin@climatejustice.ke`) with the `admin` role upon first database startup.
  2. To promote an existing registered learner to administrator, use the user directory role toggle inside the `/admin` interface or update the SQLite record directly:
     ```bash
     sqlite3 server/database.sqlite "UPDATE Users SET role = 'admin' WHERE email = 'learner@example.com';"
     ```
  3. Log in with the administrator account at `http://localhost:5173/login`, then navigate to `http://localhost:5173/admin` or click the "Admin Console" badge on `http://localhost:5173/profile`.

---

## 4. Repository Structure

| Directory / File | Description |
| :--- | :--- |
| `client/` | React 19 frontend application built with Vite and TypeScript. |
| `client/src/components/` | Reusable UI components including LessonView, QuizEngine, ClimateBuddy, Navigation, and Onboarding. |
| `client/src/contexts/` | Application state providers: AuthContext (sessions, tokens) and ProgressContext (local progress sync). |
| `client/src/data/` | Bilingual curriculum datasets, quiz item banks, action guides, glossary terms, and awareness media. |
| `client/src/lib/` | Core client libraries: `db.ts` (Dexie/IndexedDB), `speech.ts` (TTS engine), `audioCoordinator.ts`, and `searchEngine.ts`. |
| `client/src/pages/` | Routed pages: Home, Modules, Scenarios, Action, Awareness, Glossary, Profile, Login, AdminDashboard, and CertificateVerify. |
| `client/public/` | PWA manifest, service worker icons, and offline video demonstration files (`public/videos/`). |
| `server/` | Express.js REST API server providing authentication, progress sync, certificate issuance, and admin tools. |
| `server/src/models/` | Sequelize relational models (`User`, `Module`, `Lesson`, `ModuleProgress`, `Certificate`, `ProjectSubmission`, `UserSession`). |
| `server/src/services/` | Backend services: `authService.ts` (email accounts), `phoneAuthService.ts` (scrypt phone accounts), and `ttsService.ts`. |
| `server/src/index.ts` | Server entry point, API route definitions, middleware, and SQLite auto-initialization. |
| `server/tests/` | Automated test suites: `auth.test.ts`, `phoneAuth.test.ts`, `adminDashboard.test.ts`, `learningAndCertificates.test.ts`, `assistant.test.ts`, `tts.test.ts`. |
| `docs/` | Research documentation: `CONTENT_SOURCES.md` (curriculum citations) and `ENHANCEMENT_IMPLEMENTATION.md`. |
| `Implementation.md` | Comprehensive architectural documentation, detailed curriculum mapping, and research methodology. |
| `DEPLOYMENT.md` | Production deployment guide for Nginx, container environments, and static CDN hosting. |
| `animation_test.mp4` | Recorded demonstration of UI layout transitions, interactive quiz evaluation, and audio states. |

---

## 5. Walkthrough Video

- **Current Repository Demo Recording**:
  A visual UI and interaction recording is committed directly in the repository root at [`animation_test.mp4`](animation_test.mp4) (and [`animation_test.webp`](animation_test.webp)), demonstrating interface transitions, module views, and quiz evaluations.
- **External Walkthrough Video Folder**:
  A video folder link is available on Google Drive:
  [Climate Justice Nairobi Walkthrough Folder](https://drive.google.com/drive/folders/1OeKeE8YBquxES4TENzt6P05bivu1P63s?usp=sharing)
- **Submission Notice**:
  If reviewers require an unauthenticated direct video link (e.g., an unlisted YouTube or Vimeo recording without Google Drive login requirements), that link should be supplied as an external submission link or placed in this section prior to final submission.

---

## 6. Technical Report

- **Document Status**:
  The formal five-page Technical Report document is intended to be provided as a committed PDF at `docs/technical-report.pdf`.
- **Required Report Topics**:
  1. Scope and Implementation Alignment: Evidence of delivered curriculum, PWA offline capability, and dual authentication without third-party SMS dependencies.
  2. Technical Architecture and Functionality: Decoupled client-server design, IndexedDB offline data layer, and SQLite relational persistence.
  3. Testing Methodology and Verified Results: Automated unit, integration, and UI test coverage across client and server.
  4. Code Quality and Security: scrypt password hashing, session isolation, role-based admin endpoints, and elimination of sensitive credential leakage.
- **Submission Gap**:
  The compiled PDF document (`docs/technical-report.pdf`) must be generated and committed to the repository to complete this requirement.

---

## 7. Testing and Known Limitations

### Automated Testing

#### Backend Test Suite
The backend uses Jest, Supertest, and an in-memory SQLite instance (`:memory:`) to validate authentication, session handling, database migrations, learning workflows, and admin access controls.
```bash
cd server
npm test
```
- **Verified Results**: 7 test suites passed, 62 tests passed.
  - `tests/adminDashboard.test.ts`: Access control rejection (401/403), credential exclusion, and role management.
  - `tests/phoneAuth.test.ts`: scrypt hashing, phone normalization (`+254`), and SMS-free registration.
  - `tests/auth.test.ts`: Email registration, duplicate rejection, and session validation.
  - `tests/learningAndCertificates.test.ts`: Module progress, lesson completion, and certificate issuance.
  - `tests/assistant.test.ts` & `tests/tts.test.ts`: Local assistant grounding and voice synthesis fallbacks.

#### Frontend Test Suite
The frontend uses Vitest, jsdom, and React Testing Library to validate UI rendering, state transitions, speech synthesis logic, and access protection.
```bash
cd client
npm test
```
- **Verified Results**: 7 test suites passed, 42 tests passed.
  - `src/pages/AdminDashboard.test.tsx`: Route protection for non-admin accounts and admin data table rendering.
  - `src/pages/Login.test.tsx`: Authentication tab switching, password visibility, and error handling.
  - `src/components/QuizEngine.test.tsx`: Interactive option selection and instant feedback.
  - `src/components/MarkdownRenderer.test.tsx`: Text formatting and security sanitization.
  - `src/data/awareness.test.ts` & `src/data/contentValidation.test.ts`: Curriculum data structure verification.
  - `src/lib/speech.test.ts`: Acronym expansion and sentence chunking for voice synthesis.

#### Production Bundle Build Check
To verify TypeScript compilation and production bundling:
```bash
cd client
npm run build
```
- **Verified Results**: TypeScript type checking passed (`tsc -b`), and Vite generated the production bundle with Service Worker caching (`dist/sw.js`).

### Manual Verification Procedures
1. **Offline Mode**:
   - Open Chrome DevTools, navigate to the Network panel, and set throttling to "Offline".
   - Reload the application; verify curriculum modules, lessons, and interactive quizzes load from IndexedDB and Service Worker caches.
2. **Access Control**:
   - Access `http://localhost:5173/admin` as an unauthenticated user; verify redirection to login.
   - Sign in as a standard learner; verify access restriction notice appears with no administrative controls.
   - Sign in as an administrator; verify all 5 tabs (Users, Modules, Progress, Certificates, Activity) display live data from SQLite.
3. **Registration and Login**:
   - Create a new account using a Kenyan phone number (`0712...` or `+254712...`) and password.
   - Confirm immediate session creation without SMS prompts, and verify the record is visible in the admin directory.

### Known Limitations
- **Optional Cloud AI APIs**: GroqCloud and OpenAI integrations for Climate Buddy require third-party API keys configured in `server/.env`. When keys are not supplied, the platform falls back to deterministic local search over curriculum content.
- **Google OAuth Dependency**: Google Sign-In requires a client ID from Google Cloud Console. If omitted, Google authentication is disabled while native email and phone authentication remain fully operational.
- **Offline Sync Conflict Resolution**: Offline progress sync uses a last-write-wins policy. If a learner uses multiple devices offline simultaneously, the most recent sync takes precedence.
- **Browser Speech Synthesis Variations**: Speech naturalness depends on the client platform and installed operating system voices.

---

## 8. Authorship, Attribution, and License

- **Author / Lead Developer**: John Obure (BSc. in Software Engineering, African Leadership University).
- **Academic Supervisor**: Junior Turatsinze.
- **Research Scope**: African Leadership University (ALU) Software Engineering Capstone Project.
- **Curriculum and Content Attribution**: Adapted from published research by the Kenya Meteorological Department (KMD), National Environment Management Authority (NEMA), Nairobi City County Climate Change Action Plan, UNEP (Gigiri, Nairobi), and the Intergovernmental Panel on Climate Change (IPCC) Working Group reports.
- **License**: ISC License (as defined in `server/package.json`).
