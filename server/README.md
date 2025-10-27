# Server setup additions

Environment variables required:

- MONGO_DBURL=...
- SECRET_KEY=... (for legacy JWT endpoints)
- CLIENT_URL=http://localhost:5173

Firebase Admin (for /api/auth/firebase/check and future protected routes):
- FIREBASE_PROJECT_ID=...
- FIREBASE_CLIENT_EMAIL=...
- FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

SMTP email (order status notifications):
Option A — Gmail OAuth2 (recommended if App Passwords unavailable):
- GMAIL_USER=your@gmail.com
- GMAIL_CLIENT_ID=...
- GMAIL_CLIENT_SECRET=...
- GMAIL_REFRESH_TOKEN=...

Option B — Generic SMTP:
- SMTP_HOST=smtp.example.com
- SMTP_PORT=587
- SMTP_USER=apikey-or-username
- SMTP_PASS=secret
- SMTP_SECURE=false
- SMTP_FROM="Shop <no-reply@example.com>"

Client usage (Firebase): send Authorization: Bearer <idToken> to protected APIs. Example: call GET /api/auth/firebase/check to verify session.
