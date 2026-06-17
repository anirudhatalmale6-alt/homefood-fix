# FA BUI Backend (HomeFood)

TypeScript + Node.js backend for user management, group bidding, service matching, and escrow-style payments.

## Features

- User signup/login with JWT
- User profile with home location and VIP flag
- Group creation/joining for group bidding
- Job posting by homeowners
- User/group bidding on jobs
- Owner bid selection
- Escrow deposit to company account
- Job completion + payment release to worker

## Tech Stack

- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- Zod for request validation

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and set values:

   ```env
   PORT=4000
   MONGO_URL=your_mongodb_connection_string
   DB_NAME=homefood
   JWT_SECRET=replace_with_a_long_secret_key
   ```

3. Run development server:

   ```bash
   npm run dev
   ```

4. Build for production:

   ```bash
   npm run build
   npm start
   ```

## API Overview

- Interactive docs (Swagger UI): `GET /api/docs`
- OpenAPI JSON spec: `GET /api/docs.json`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/users/me`
- `POST /api/groups`
- `POST /api/groups/:groupId/join`
- `GET /api/groups/:groupId`
- `POST /api/jobs`
- `GET /api/jobs`
- `GET /api/jobs/:jobId`
- `POST /api/jobs/:jobId/bids`
- `POST /api/jobs/:jobId/select-bid/:bidId`
- `POST /api/payments/jobs/:jobId/escrow-deposit`
- `POST /api/payments/jobs/:jobId/mark-complete`
- `POST /api/payments/jobs/:jobId/release-payment`
- `GET /api/menu/catalog`
- `POST /api/orders`
- `GET /api/orders/me`
- `POST /api/agent/chat`

Use `Authorization: Bearer <JWT_TOKEN>` for protected endpoints.

## Food orders & AI assistant

- `GET /api/menu/catalog` — public menu (dish ids, prices) for storefront / AI
- `POST /api/orders` — create order (optional Bearer attaches order to account)
- `GET /api/orders/me` — list my orders (Bearer required)
- `GET /api/orders/me/:orderId` — order detail (Bearer, owner only)
- `POST /api/agent/chat` — body `{ "messages": [{ "role": "user"|"assistant", "content": "..." }] }` — OpenAI tool loop with `get_menu`, `preview_order`, `submit_order`. Requires `OPENAI_API_KEY`; optional `AI_MODEL` (default `gpt-4o-mini`).

## Extra dependencies (AI & safety)

- **AI:** `ai`, `@ai-sdk/openai`, `@ai-sdk/anthropic`, `openai`, `@google/generative-ai` (Anthropic and Google SDKs are installed for future multi-provider routing; the current assistant uses OpenAI via the AI SDK).
- **Safety / hardening:** `hpp` (HTTP parameter pollution), `express-slow-down` (progressive delay on hot paths), `sanitize-html` + `validator` (order notes / email normalization).

## Backend Management Middleware

- `helmet` for secure headers
- `express-rate-limit` for abuse protection
- `express-slow-down` on `/api/agent/chat` (combined with a stricter rate limit)
- `hpp` after body parsers
- `morgan` for request logging
- `compression` for response compression
- `cookie-parser` for cookie support
- `express-mongo-sanitize` for Mongo query payload hardening
- Centralized 404 + error response handler with request IDs
