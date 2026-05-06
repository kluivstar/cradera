# Cradera FinTech platform MVP

Cradera is a premium digital asset platform tailored for strict manual custodial services, Institutional clients, and elite VIP users. The workflow requires clients to register, pass Identity Verification (KYC), and coordinate transactions manually.

## Project Structure

- **`/api`**: Express.js backend API (Hardened for production).
- **`/client`**: Vite/React frontend dashboard.

### Tech Stack
- **Backend**: Node.js, Express.js, MongoDB (Atlas).
- **Security**: JWT, bcryptjs, Helmet, Express Rate Limit, Mongo Sanitize.
- **Frontend**: Vite, React, Vanilla CSS, Axios.
- **Email**: Resend API.

## Environment Configuration

Both the API and Client require environment variables. Refer to the `.env.example` files in their respective directories:
- [API .env.example](api/.env.example)
- [Client .env.example](client/.env.example)

## Running Locally

### 1. Start the API (Port 5000)
```bash
cd api
npm install
npm run dev
```

### 2. Start the Client (Port 5173)
```bash
cd client
npm install
npm run dev
```

## Production Deployment

### Backend (e.g., Render)
1. Set the **Root Directory** to `api`.
2. Build Command: `npm install`
3. Start Command: `node src/server.js`
4. Configure all environment variables from `api/.env.example`.

### Frontend (e.g., Vercel)
1. Set the **Root Directory** to `client`.
2. Framework Preset: `Vite`.
3. Configure `VITE_API_URL` pointing to your deployed API (e.g., `https://api.cradera.com/api/v1`).
4. Ensure the backend CORS configuration allows your frontend domain.

## Standardized API
The platform uses a versioned API structure: `GET /api/v1/health` for health checks.
All endpoints return a standardized JSON format: `{ success: boolean, message?: string, data?: any }`.

---
© 2026 Cradera Platform Deployment Guide

