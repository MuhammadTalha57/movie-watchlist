# Movie Watchlist (Full Stack)

A full-stack movie watchlist application with authentication and per-user movie management.

## Project Structure

- `backend/` Express + MongoDB Atlas API
- `frontend/` React + Vite client

## Features

- User signup and login
- JWT-based authenticated APIs
- CRUD movies for each logged-in user
- Responsive modern frontend
- Light and dark mode
- Movie cards grid with details view

## Backend Setup

From `backend/`:

```bash
npm install
```

Create `backend/.env`:

```env
DATABASE_URL=mongodb+srv://<username>:<password>@<cluster-url>/?appName=Cluster0
JWT_SECRET=<strong-random-secret>
DNS_SERVERS=8.8.8.8,1.1.1.1
PORT=5000
```

Run backend:

```bash
npm run dev
```

## Frontend Setup

From `frontend/`:

```bash
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Run frontend:

```bash
npm run dev
```

## API Endpoints

Auth:

- `POST /auth/register`
- `POST /auth/login`

Movies (requires `Authorization: Bearer <token>`):

- `GET /movies`
- `GET /movies/:id`
- `POST /movies`
- `PUT /movies/:id`
- `DELETE /movies/:id`

## Deploy on Vercel

Vercel is best used here for the frontend. For backend, you can either deploy to another Node host (recommended quick path) or refactor backend for Vercel serverless functions.

### Option A (Recommended): Frontend on Vercel + Backend on Render/Railway

1. Deploy backend to Render or Railway.
2. Deploy frontend to Vercel with root directory `frontend`.
3. In Vercel project settings, set:
    - `VITE_API_URL=https://your-backend-domain.com`

4. Redeploy frontend.

### Option B: Deploy Both to Vercel

To deploy backend on Vercel, Express app should be adapted to Vercel Functions (serverless entrypoint and routing config). Current backend is a long-running server (`app.listen`) designed for Node server hosting.

If you want, I can prepare the backend for Vercel serverless deployment in the next step.

## Common Issues

- `querySrv ECONNREFUSED` on Atlas: local Node DNS SRV lookup issue. Set `DNS_SERVERS=8.8.8.8,1.1.1.1`.
- Atlas connection refused: add your public IP in Atlas Network Access.
- Auth errors: verify `JWT_SECRET` exists in backend `.env`.
