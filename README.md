# Cradera FinTech platform MVP

Cradera is a premium digital asset platform tailored for strict manual custodial services, Institutional clients, and elite VIP users. The workflow requires clients to register, pass Identity Verification (KYC), and coordinate transactions manually.

## Express.js Refactor

The backend of this project has been fully decoupled from NestJS and cleanly written in **Express.js**, promoting long-term architectural simplicity and maintainability for single-engineer oversight.

### Tech Stack
- **Backend**: Node.js, Express.js, Mongoose (MongoDB)
- **Validation**: Joi (Body & Schema validation)
- **Security**: JWT (`jsonwebtoken`), Password Hashing (`bcryptjs`), Rate Limiting (`express-rate-limit`), Helmet
- **Frontend**: Next.js App Router (React), Vanilla CSS (Glassmorphism), Framer Motion

### Architecture Map
The API logic follows an extremely clean pipeline ensuring traceability and module isolation:
`Routes -> Middleware -> Controllers -> Services -> Mongoose Models`

- **routes/**: Aggregates modular domain routes.
- **controllers/**: Exceptionally thin HTTP request/response interception blocks. 
- **services/**: All underlying MongoDB querying, hashing, and notification orchestration logically lives here.
- **models/**: Expressing clear schema boundaries.

## Running Locally

### 1. Start the Express API

Ensure you have a local MongoDB instance running (or update the `.env` file).

```bash
cd api
npm install
node src/server.js
```

The Express API server starts immediately on port `4000`.

### 2. Start the Frontend Client

No modifications are necessary here thanks to equivalent `/api/v1` API parity.

```bash
cd client
npm install
npm run dev
```

The Next.js interactive frontend launches natively on `3000`.

### Included Resources
- **Postman Collection**: Refer to `Cradera_API_Postman.json` at the project root to instantly import all Express endpoints into your environment.
