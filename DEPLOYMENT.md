# Climate Justice Nairobi - Production Deployment & Hosting Guide

This guide details the deployment architecture, configuration, build commands, and hosting specifications for **Climate Justice Nairobi** ([climatejusticenairobi.org](https://climatejusticenairobi.org)), an independent, offline-first climate education platform focused strictly on Kenyan ecological challenges, adaptation pathways, and community resilience.

---

## 1. System Architecture

The application is structured into two decoupled, container-ready tiers:

```
                      Internet / Learners
                              │
                              ▼
            ┌───────────────────────────────────┐
            │   Reverse Proxy (Nginx / Caddy)   │
            │   - TLS/HTTPS Termination         │
            │   - SPA Fallback: /index.html     │
            │   - Static Asset Caching          │
            └─────────┬───────────────┬─────────┘
                      │               │
        /api/v1/*     │               │  Static SPA Assets
        (Proxy Pass)  ▼               ▼  (HTML, JS, CSS, Media)
    ┌──────────────────────┐    ┌──────────────────────┐
    │  Express API Server  │    │  Vite Production SPA │
    │  Node.js (Port 3001) │    │  (client/dist)       │
    └──────────┬───────────┘    └──────────────────────┘
               │
    ┌──────────┴───────────┐
    │  Sequelize Data Tier │
    │  - SQLite (Default)  │
    │  - Or PostgreSQL     │
    └──────────────────────┘
```

- **Frontend (`client/`)**: React 19 Single Page Application (SPA) built with Vite, TypeScript, and Progressive Web App (PWA) offline service workers. All API calls utilize standard relative paths (`/api/v1/*`), eliminating cross-origin CORS conflicts when reverse-proxied.
- **Backend (`server/`)**: Express.js REST API providing secure session authentication, HMAC-SHA256 OTP phone verification, curriculum modules, idempotent progress sync, tamper-evident certificate issuance, and role-based staff authorization.
- **Database Persistence**: Sequelize ORM utilizing SQLite (`database.sqlite`) for self-contained single-node hosting, or PostgreSQL via `DATABASE_URL` for distributed container clusters.
- **Third-Party Gateways (Optional / Launch Dependency)**:
  - **SMS OTP Gateway**: Africa's Talking (recommended for Kenya `+254`) or Twilio.
  - **OAuth**: Google Identity Services.
  - **AI / TTS**: GroqCloud (Free Developer Tier) for online Climate Buddy; falls back seamlessly to deterministic offline curriculum indexing when unconfigured.

---

## 2. Production Build & Start Commands

### Prerequisites
- Node.js 20.x or 22.x LTS
- npm 10.x or higher

### Step 1: Install Dependencies
```bash
# In client/
cd client
npm ci

# In server/
cd ../server
npm ci
```

### Step 2: Build the Frontend Production Bundle
```bash
cd client
npm run build
```
This produces optimized, hashed static assets inside `client/dist/`, including the Service Worker and Web App Manifest (`manifest.webmanifest`).

### Step 3: Run Test Verification
Ensure all 6 server test suites and 5 client test suites pass before deploying:
```bash
# Verify Server
cd server
npm test

# Verify Client Build & Types
cd ../client
npm run test:run
npm run build
```

### Step 4: Start the Production Server
```bash
cd server
NODE_ENV=production npm start
```
*Note: In production environments, manage the server process using PM2, systemd, or a Docker container supervisor.*

---

## 3. Environment Variables Reference

### Backend Configuration (`server/.env`)
Copy `server/.env.example` to `server/.env` and supply production values:

| Variable | Required? | Default | Purpose / Notes |
| :--- | :--- | :--- | :--- |
| `PORT` | No | `3001` | Local port the Express server binds to. |
| `NODE_ENV` | Yes | `production` | Enables production optimizations and disables debug traces. |
| `ALLOWED_ORIGIN` | Yes | `https://climatejusticenairobi.org` | Allowed origin for CORS headers. |
| `SQLITE_DB_PATH` | No | `./database.sqlite` | Absolute or relative path to persistent SQLite database file. |
| `DATABASE_URL` | No | *(None)* | PostgreSQL connection URI (takes precedence over SQLite if set). |
| `ADMIN_EXPORT_SECRET` | Yes | *(None)* | High-entropy 64-character secret for administrative endpoints. |
| `AFRICASTALKING_USERNAME` | Conditional | *(None)* | Africa's Talking username (required for live Kenyan SMS OTP). |
| `AFRICASTALKING_API_KEY` | Conditional | *(None)* | Africa's Talking API key (required for live Kenyan SMS OTP). |
| `TWILIO_ACCOUNT_SID` | Conditional | *(None)* | Twilio Account SID (alternative SMS provider). |
| `TWILIO_AUTH_TOKEN` | Conditional | *(None)* | Twilio Auth Token (alternative SMS provider). |
| `TWILIO_PHONE_NUMBER` | Conditional | *(None)* | Twilio E.164 phone number. |
| `GOOGLE_CLIENT_ID` | No | *(None)* | Google OAuth Web Client ID for Google One-Tap sign-in. |
| `GROQ_API_KEY` | No | *(None)* | GroqCloud API key for online AI assistant (falls back to offline). |
| `OPENAI_API_KEY` | No | *(None)* | OpenAI key for neural TTS (falls back to Web Speech API). |

### Frontend Configuration (`client/.env.local`)
Copy `client/.env.example` to `client/.env.local`:

| Variable | Required? | Default | Purpose / Notes |
| :--- | :--- | :--- | :--- |
| `VITE_GOOGLE_CLIENT_ID` | No | *(None)* | Google OAuth Web Client ID matching server configuration. |
| `VITE_API_BASE_URL` | No | `""` (relative `/api/v1`) | Base URL for API requests if hosted on an isolated static CDN. |

---

## 4. Reverse Proxy Configuration (Nginx & Caddy)

Because the client uses client-side routing via React Router (`/pathways`, `/case-studies`, `/climate-data`, `/verify/:certId`), the web server **must** return `index.html` for any unrecognized direct links or page refreshes.

### Production Nginx Blueprint (`/etc/nginx/sites-available/climatejusticenairobi`)

```nginx
server {
    listen 80;
    server_name climatejusticenairobi.org www.climatejusticenairobi.org;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name climatejusticenairobi.org www.climatejusticenairobi.org;

    ssl_certificate /etc/letsencrypt/live/climatejusticenairobi.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/climatejusticenairobi.org/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    root /var/www/climatejusticenairobi/client/dist;
    index index.html;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

    # Gzip / Brotli Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    # Static Assets with Long-Term Caching
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Reverse Proxy API Requests to Node.js Backend
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 10M;
    }

    # Single Page Application (SPA) Fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Production Caddy Blueprint (`Caddyfile`)

```caddy
climatejusticenairobi.org {
    encode gzip zstd

    # Proxy API requests
    handle /api/* {
        reverse_proxy 127.0.0.1:3001
    }

    # Serve static frontend SPA with fallback
    handle {
        root * /var/www/climatejusticenairobi/client/dist
        try_files {path} /index.html
        file_server
    }
}
```

---

## 5. Persistent Storage & Database Integrity

1. **SQLite Database File**:
   - The default database is located at `./database.sqlite` relative to `server/`.
   - Ensure the directory containing `database.sqlite` has read/write permissions for the `node` process user (`chown -R node:node /app/server`).
   - If running inside Docker, mount the database directory to a persistent volume:
     `-v /var/data/climate-justice:/app/server/data` and configure `SQLITE_DB_PATH=/app/server/data/database.sqlite`.

2. **Automated Schema Initialization**:
   - The server uses `setupDb()` in `server/src/models/index.ts` with `sequelize.sync({ alter: false })`, which safely verifies existing tables (`Users`, `Certificates`, `ProjectSubmissions`, `PhoneVerifications`, `LessonProgress`, etc.) without dropping data.

3. **Backup Strategy**:
   - Create daily automated SQLite snapshots via SQLite backup API or standard atomic copies:
     ```bash
     sqlite3 /var/data/climate-justice/database.sqlite ".backup '/var/backups/cjn-db-$(date +%F).sqlite'"
     ```

---

## 6. Resolving the Remaining Launch Blocker: Live SMS Gateway Setup

The platform's phone authentication (`+254` Kenya default) has been built with full HMAC-SHA256 OTP hashing, 60-second resend rate limiting, 10-minute expiry, and backend verification. 

When no SMS provider credentials are configured, the frontend transparently informs learners that SMS dispatch is awaiting gateway activation and prevents simulated successes.

### To activate live Kenyan SMS delivery via Africa's Talking:
1. Register an account at [Africa's Talking](https://account.africastalking.com/).
2. Create an application and obtain:
   - **Username**: (e.g. `sandbox` for development, or your production app name).
   - **API Key**: Under `Settings > API Key`.
3. Optionally configure an approved Kenyan Sender ID (e.g. `CLIMATE_NRB`) with CAK approval.
4. Add credentials to `server/.env`:
   ```bash
   AFRICASTALKING_USERNAME=your_at_username
   AFRICASTALKING_API_KEY=your_at_api_key
   ```
5. Restart the server. The `/api/v1/auth/phone/status` endpoint will automatically switch to `{ available: true }`, unlocking live SMS OTP code delivery for all Kenyan users.
