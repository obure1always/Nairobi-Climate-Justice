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
    │  - SQLite            │
    └──────────────────────┘
```

- **Frontend (`client/`)**: React 19 Single Page Application (SPA) built with Vite, TypeScript, and Progressive Web App (PWA) offline service workers. All API calls use one configured base URL, defaulting to relative `/api/v1/*` paths when reverse-proxied.
- **Backend (`server/`)**: Express.js REST API providing secure session authentication, scrypt cryptographic password hashing for phone-and-password and email-and-password accounts, curriculum modules, idempotent progress sync, tamper-evident certificate issuance, and role-based staff authorization.
- **Database Persistence**: Sequelize ORM using SQLite. The production Render setup below mounts the database on a persistent disk.
- **Zero Third-Party SMS Gateway Dependency**:
  - **Phone Authentication**: Fully self-contained phone-and-password authentication. No Africa's Talking or Twilio accounts or SMS fees are required.
  - **OAuth (Optional)**: Google Identity Services.
  - **AI / TTS (Optional)**: GroqCloud (Free Developer Tier) for online Climate Buddy; falls back seamlessly to deterministic offline curriculum indexing when unconfigured.

---

## 2. Production Build & Start Commands

### Prerequisites
- Node.js 24.22.1 (tested for this release)
- npm 10.x or higher

### Render service commands

Configure one Render Web Service and leave **Root Directory** blank so both packages are available.

```text
Build Command: npm --prefix client ci --include=dev && npm --prefix server ci --include=dev && npm --prefix client run build
Start Command: cd server && node --import tsx src/index.ts
Health Check Path: /api/v1/health
```

Set `NODE_VERSION=24.22.1` and `NODE_ENV=production` in the Render environment. The server serves the built `client/dist` directory and handles both the API and SPA on the same origin.

### Local install and build

```bash
# From the repository root
npm ci --prefix client
npm ci --prefix server
npm run build --prefix client
```
This produces optimized, hashed static assets inside `client/dist/`, including the Service Worker and Web App Manifest (`manifest.webmanifest`).

### Local test verification

```bash
npm test --prefix server -- --runInBand
npm test --prefix client
```

### Local start command

```bash
NODE_ENV=production npm start --prefix server
```

---

## 3. Environment Variables Reference

### Backend Configuration (`server/.env`)
Copy `server/.env.example` to `server/.env` and supply production values:

| Variable | Required? | Default | Purpose / Notes |
| :--- | :--- | :--- | :--- |
| `PORT` | No | `3001` | Local port the Express server binds to. |
| `NODE_ENV` | Yes | `production` | Enables production optimizations and disables debug traces. |
| `ALLOWED_ORIGIN` | Yes | `https://climatejusticenairobi.org` | Allowed origin for CORS headers. |
| `SQLITE_DB_PATH` | Yes on Render | `/var/data/database.sqlite` | Absolute path on the service's persistent disk. |
| `INITIAL_ADMIN_EMAIL` | First setup only | *(None)* | Email for creating the first administrator when the database has no admin. |
| `INITIAL_ADMIN_PASSWORD` | First setup only | *(None)* | Unique password of at least 14 characters for first-admin setup; not used after an admin exists. |
| `GOOGLE_CLIENT_ID` | No | *(None)* | Google OAuth Web Client ID for Google One-Tap sign-in. |
| `GROQ_API_KEY` | No | *(None)* | GroqCloud API key for online AI assistant (falls back to offline). |
| `OPENAI_API_KEY` | No | *(None)* | OpenAI key for neural TTS (falls back to Web Speech API). |
| `CERTIFICATE_SIGNATURE_PATH` | Yes for production certificates | `/var/data/certificate-signature.png` | Private PNG/JPEG path outside the static client directory. |
| `CERTIFICATE_EMAIL_PROVIDER` | Yes for certificate emails | `resend` | Configures the Resend adapter. |
| `RESEND_API_KEY` | Yes for certificate emails | *(None)* | Resend API key; set only in Render's private environment. |
| `CERTIFICATE_FROM_EMAIL` | Yes for certificate emails | *(None)* | Verified sender address for Resend. |

### Frontend Configuration (`client/.env.local`)
Copy `client/.env.example` to `client/.env.local`:

| Variable | Required? | Default | Purpose / Notes |
| :--- | :--- | :--- | :--- |
| `VITE_GOOGLE_CLIENT_ID` | No | *(None)* | Google OAuth Web Client ID matching server configuration. |
| `VITE_API_BASE_URL` | No | `""` (relative `/api/v1`) | API origin or full base URL; `/api/v1` is appended unless already present. |

### Render Persistent Disk

For a Render service using SQLite, attach a persistent disk to the backend service with mount path `/var/data`, then set the service environment variable:

```text
SQLITE_DB_PATH=/var/data/database.sqlite
```

Use the same service disk for the approved signature image, but keep the file outside `client/` and `client/dist/`:

```text
CERTIFICATE_SIGNATURE_PATH=/var/data/certificate-signature.png
```

Privately upload the approved PNG or JPEG to that exact path using the service's private shell/secure transfer workflow, restrict its permissions to the server user, and never commit it or place it under a public directory. Certificate PDF creation fails explicitly in production if the image is missing or unreadable; the signed image is embedded by the server and is not exposed as a static asset.

Certificate email settings use the Resend adapter:

```text
CERTIFICATE_EMAIL_PROVIDER=resend
RESEND_API_KEY=<set privately in Render>
CERTIFICATE_FROM_EMAIL=<verified sender address>
```

Verify the sender domain/address with Resend before the live test. Delivery requires a persisted `emailVerified` account flag. Google sign-in sets it only when Google's verified-email claim is true; email/password and phone accounts are not treated as verified just because they have an address. Legacy Google accounts must sign in again to refresh the verified claim; older SQLite rows are not assumed verified. The same server-generated PDF bytes are attached to the email and returned by the authenticated dashboard download endpoint. A failed send is recorded in SQLite and can be retried from the dashboard; a send failure does not revoke or disable the certificate download. Completed progress and quiz syncs create an idempotent outbox entry, while repeated completion events do not resend a sent or failed delivery. Resend receives a stable per-certificate idempotency key.

The backend logs the resolved SQLite path at startup; its admin dashboard reports the same path. Do not rely on the deploy's working directory or a relative file path for persistent production storage.

The backend does not create public demo accounts or passwords. Before the first start on an empty database, set `INITIAL_ADMIN_EMAIL` and a unique `INITIAL_ADMIN_PASSWORD` of at least 14 characters in the service environment. Once the administrator can sign in, remove the password variable; setup is skipped whenever an administrator already exists.

To confirm which live issue occurred, review the Render service's startup logs and verify the logged path is under `/var/data`, the disk is mounted on that same service, and the admin dashboard reports that same storage path and lists the registered account. Then compare the production frontend's `VITE_API_BASE_URL`/served deployment with the backend URL handling `/api/v1/auth/login` and `/api/v1/admin/dashboard`. A path outside the mounted disk, a missing disk, or data disappearing after restart indicates the SQLite file was ephemeral or a different file was opened; a live account missing from the database while the expected persistent path is mounted suggests registration/login reached different backend instances or deployments. These checks require access to Render and were not performed locally.

### Render SQLite and legacy-admin migration plan (review only)

Do not deploy this migration until the database owner has approved the change and a rollback window:

1. **Identify and back up the current database.** Record the existing service, database path, persistent-disk mount, and current deployment. Stop writes for the maintenance window, then create a SQLite-consistent backup with SQLite's `.backup` command. Keep the original file unchanged and verify the backup opens and has the expected user, progress, and certificate counts.
2. **Attach persistent storage before changing the service.** Mount the Render disk at `/var/data`. Copy the existing SQLite database into that mount while writes are stopped; do not start an empty database at the new path. Set `SQLITE_DB_PATH=/var/data/database.sqlite`. Keep the prior file and backup intact until post-migration checks pass.
3. **Test against a staging copy first.** Start the candidate release with a copy of the database, check that schema synchronization preserves all existing rows, sign in as a legitimate administrator, review learner/admin progress, and download an existing certificate. Restart staging against the same copied file and repeat those checks.
4. **Review administrator accounts privately.** On the staging copy, list admin account IDs, emails, and sign-in providers without exporting or logging password hashes. Confirm with the account owner which account is legitimate and which, if any, is a public/demo account. Do not infer this from an email alone.
5. **Preserve legitimate access before disabling a demo.** Confirm or establish a named, owner-controlled admin account on the staging copy, verify its login and admin dashboard, and keep it active. If the confirmed legacy demo account is an email account and its current credential is known, rotate it through the authenticated password-change flow. If it is shared, its credential is unknown, or it cannot be safely rotated, use a reviewed SQLite transaction to demote only that confirmed account after the replacement admin has been verified. Do not delete the account or its learning/audit records. Do not demote the last usable admin.
6. **Promote the change with rollback ready.** Repeat the staged steps during the approved maintenance window. Confirm the startup log reports `/var/data/database.sqlite`, the registered learner and admin records remain present, login/admin routes work, and restart preserves the same data. If any check fails, stop writes and restore the preserved database/disk configuration; do not point production at an empty file.

The current first-admin environment setup only creates an administrator when no admin exists. It will not automatically replace or disable a legacy/demo admin on an existing database; that account review and any role change require explicit approval.

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
   - The default database is located at `./database.sqlite` relative to the backend process working directory (normally `server/` for the documented commands).
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

## 6. Phone & Password Authentication Architecture (Zero External Cost)

The platform provides genuine, production-ready phone authentication without SMS provider dependencies:

- **Registration**: Learners create an account using their name, phone number, and password (minimum 8 characters), with an optional secondary recovery email.
- **Normalization**: Kenyan phone numbers are consistently normalized into standard E.164 international `+254` format (supporting `07...`, `01...`, `7...`, `+254...`, `254...`).
- **Security & Password Hashing**: Passwords are cryptographically salted and hashed using Node's native `scryptSync` (64-byte key).
- **Session Tokens**: Authenticated sessions are issued server-side (`/api/v1/auth/phone/login` and `/api/v1/auth/phone/register`) and verified on protected endpoints.
- **Brute-Force Protection**: An in-memory rate-limiter locks accounts for 15 minutes after 5 consecutive failed login attempts.
- **Emergency Password Recovery**: Each account receives a 16-character cryptographic recovery code (`XXXX-XXXX-XXXX-XXXX`) at registration. Passwords can only be reset by supplying this secret recovery code; phone ownership remains marked as unverified and passwords can never be reset by knowing the phone number alone.
- **Zero Third-Party Cost**: No Africa's Talking or Twilio accounts, sender ID registrations, or SMS per-message fees are required to deploy or operate the platform.
