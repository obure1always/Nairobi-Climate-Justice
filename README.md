# Climate Justice Nairobi

An interactive, offline-first educational web application designed to teach youth in Nairobi about climate justice, adaptation, and civic participation.

## GitHub Repository
**Source Code:** [https://github.com/obure1always/Nairobi-Climate-Justice](https://github.com/obure1always/Nairobi-Climate-Justice)

## Tech Stack

### Frontend (Client)
- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS + `lucide-react`
- **Animations**: Framer Motion
- **Offline Storage**: Dexie (IndexedDB)
- **PWA Support**: `vite-plugin-pwa`
- **Testing**: Vitest + React Testing Library

### Backend (Server)
- **Framework**: Express.js + Node.js
- **Database**: SQLite
- **ORM**: Sequelize
- **Testing**: Jest + Supertest

---

##  Requirements

Ensure you have the following installed before setting up the project:
- **Node.js**: `v18.0.0` or higher (tested on Node v22+)
- **npm**: `v9.0.0` or higher

---

##  Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/obure1always/Nairobi-Climate-Justice.git
cd Nairobi-Climate-Justice
```

### 2. Setup the Backend (Server)
The backend manages participant registration, module progress, and quiz assessments, storing them in a local SQLite database.

```bash
cd server
npm install
```

Start the backend server in development mode (runs on `http://localhost:3001`):
```bash
npm start
```
*(Note: If the `npm start` script is not defined, you can use `npx tsx src/index.ts` or `npm run dev` if configured).*

### 3. Setup the Frontend (Client)
The frontend is a fully responsive, offline-capable PWA.

Open a new terminal window:
```bash
cd client
npm install
```

Start the Vite development server (runs on `http://localhost:5173`):
```bash
npm run dev
```

---

## Designs (Mockups & Architecture)

**UI/UX Design**: 
The application utilizes an **"Organic Biophilic"** design theme. Recognizing the context of climate justice and environmental adaptation, the interface is built around natural aesthetics.
- **Demo Video**: (https://drive.google.com/drive/folders/1OeKeE8YBquxES4TENzt6P05bivu1P63s?usp=sharing)
- **Screenshots**: Below is a demonstration of the live UI transitions between the educational modules and the dynamic interactive quiz states:
  ![Animation and UI Test Recording](https://github.com/obure1always/Nairobi-Climate-Justice/blob/main/animation_test.webp)

---

## Deployment Plan

**Frontend (Client)**: 
The frontend is a static Progressive Web App (PWA) built with Vite. It is compiled via `npm run build` into a static bundle in the `/dist` directory. This static bundle should be deployed to a high-availability CDN capable of static hosting, such as **Vercel**, **Netlify**, or **Cloudflare Pages**. 

**Backend (Server)**:
The Express backend requires a Node.js runtime and persisting file storage for the SQLite database. It should be deployed to a Platform-as-a-Service (PaaS) like **Render**, **Railway**, or a standard VPS (e.g., DigitalOcean Droplet, AWS EC2).
- **Start Command**: `npm start`
- **Environment Variables**: Port should be dynamically assigned based on the environment (e.g., `PORT=8080`).

---

## Testing

The project is equipped with automated tests for both the frontend and backend.

### Backend Tests
The backend uses Jest and Supertest to validate API endpoints and database models.
```bash
cd server
npm run test
```

### Frontend Tests
The frontend uses Vitest to test component rendering and logic.
```bash
cd client
npm run test
```

---

## 🎙️ Voice & Audio System (Climate Buddy)

Climate Buddy features a humanized voice system designed for clear learning in English and Kiswahili:
- **Audio Coordinator**: A global singleton controller (`audioCoordinator.ts`) guarantees that only one audio source (speech narration, video audio, or assistant response) plays at any time, preventing overlapping sound.
- **Natural Voice Selection**: Prioritizes modern, natural/neural voices available on the user's OS and browser (Google Natural, Apple Siri/Enhanced Samantha, Microsoft Neural) and filters out obsolete robotic legacy synthesizers.
- **Sentence Chunking & Acronym Expansion**: Eliminates the Chromium 15-second speech freeze bug while expanding technical acronyms (e.g., `UNFCCC`, `NEMA`, `CIDP`, `CO2`) for natural spoken diction.
- **Optional Studio Cloud Voice (OpenAI / ElevenLabs)**: By default, the application runs 100% free and offline using client-side synthesis. If you wish to enable studio-grade cloud neural audio, configure the following in [`server/.env`](file:///Users/johnobure/Nairobi-Climate-Justice/server/.env):
  ```env
  OPENAI_API_KEY=your_openai_api_key_here
  OPENAI_TTS_VOICE=nova
  ```

---

## 📺 Climate Change Awareness Hub

A dedicated video awareness section (`/awareness`) featuring verified documentation from credible humanitarian and scientific authorities:
- **Verified Sources**: BBC News Africa, UNEP (Gigiri, Nairobi), Kenya Red Cross Society, DW Planet A, Al Jazeera, and Fridays For Future Kenya.
- **Mobile-Friendly & Safe Bandwidth**: `autoplay=0` disabled by default, lazy-loaded responsive 16:9 containers, and direct external watch fallbacks.
- **Practical Community Action**: Every video features tangible community adaptation solutions (Go-Bag preparedness, sack gardening, roof insulation barriers, and riparian protection).

---

## Project Structure
- `/client`: The React frontend application.
  - `/src/components`: UI components (ClimateBuddy, LessonView, Navigation, GuestTransferModal, etc.).
  - `/src/lib`: Speech synthesis engine, global audio coordinator, and local assistant retrieval engine.
  - `/src/pages`: Awareness hub, curriculum viewer, decision scenarios, action guides, and glossary.
  - `/src/data`: Curriculum content, awareness videos, FAQs, and validation test suites.
- `/server`: The Express backend API.
  - `/src/models`: Sequelize ORM models.
  - `/src/services`: Auth service, conversational grounding assistant, and TTS service.
  - `/src/index.ts`: API route definitions.
  - `/tests`: Test suites for auth, assistant, API, and TTS.

