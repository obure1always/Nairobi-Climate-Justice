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
- **Figma Mockups & Flow**: (Please link your Figma files here)
- **Screenshots**: Below is a demonstration of the live UI transitions between the educational modules and the dynamic interactive quiz states:
  ![Animation and UI Test Recording](file:///C:/Users/LENOVO/Downloads/John%20Obure%20Project/animation_test.webp)

**Hardware Integration (Circuit Diagrams)**: 
*Note: As this is a pure software-based Progressive Web App (PWA) with a Node.js backend, there are no hardware circuit diagrams associated with this project.*

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

## Project Structure
- `/client`: The React frontend application.
  - `/src/components`: Reusable UI components (QuizEngine, AssessmentView, etc.).
  - `/src/contexts`: React Contexts (ProgressContext for offline data sync).
  - `/src/data`: Curriculum content and quiz data.
- `/server`: The Express backend API.
  - `/src/models`: Sequelize ORM models.
  - `/src/index.ts`: Main server entry point and API route definitions.
  - `/tests`: API integration tests.
