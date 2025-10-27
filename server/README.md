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
- SMTP_HOST=smtp.example.com (for SendGrid use smtp.sendgrid.net)
- SMTP_PORT=587
- SMTP_USER=apikey-or-username (for SendGrid use 'apikey')
- SMTP_PASS=secret (SendGrid API key)
- SMTP_SECURE=false
- SMTP_REQUIRE_TLS=true
- SMTP_FROM="Shop <no-reply@example.com>"

Optional HTTP fallback (avoids SMTP egress):
- SENDGRID_API_KEY=... (and optionally SENDGRID_FROM)

Client usage (Firebase): send Authorization: Bearer <idToken> to protected APIs. Example: call GET /api/auth/firebase/check to verify session.
