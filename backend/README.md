# Lumière Backend API

Backend service for the Lumière Pâtisserie website contact form.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and configure your SMTP settings:
   ```bash
   cp .env.example .env
   ```

3. Run the server:
   ```bash
   npm start
   ```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port (default: 3000) | `3000` |
| `SMTP_HOST` | SMTP server hostname | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_SECURE` | Use TLS (true/false) | `false` |
| `SMTP_USER` | SMTP username/email | `your-email@gmail.com` |
| `SMTP_PASS` | SMTP password or app password | `xxxx-xxxx-xxxx-xxxx` |
| `MAIL_FROM` | Sender email address | `noreply@lumiere.com` |
| `MAIL_TO` | Recipient email address | `orders@lumiere.com` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://lumiere-website-production.up.railway.app` |

## Gmail Setup

If using Gmail:
1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password: Google Account → Security → App Passwords
3. Use the app password as `SMTP_PASS`

## Endpoints

- `GET /` - Health check
- `GET /api/health` - API health check
- `POST /api/contact` - Submit contact form

## Deploy to Railway

1. Create a new project in Railway
2. Connect this repository
3. Set the root directory to `backend`
4. Add environment variables in Railway dashboard
5. Deploy!
