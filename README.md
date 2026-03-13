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

## Deploy on Vercel (Frontend + Backend)

This repo is now ready for Vercel deployment on both sides.

### 1. Deploy Backend Project on Vercel

1. Push repository to GitHub.
2. In Vercel, create a new project from this repo.
3. Set **Root Directory** to `backend`.
4. Keep framework as **Other**.
5. Add backend environment variables in Vercel Project Settings:
    - `DATABASE_URL` = your MongoDB Atlas SRV URL
    - `JWT_SECRET` = strong random secret
    - `DNS_SERVERS` = `8.8.8.8,1.1.1.1`
6. Deploy.

Backend uses `backend/vercel.json` and serverless entrypoint `backend/api/index.js`.

### 2. Deploy Frontend Project on Vercel

1. Create another Vercel project from the same repo.
2. Set **Root Directory** to `frontend`.
3. Framework Preset: **Vite**.
4. Add env variable:
    - `VITE_API_URL` = your deployed backend URL (for example `https://movie-watchlist-api.vercel.app`)
5. Deploy.

### 3. Atlas Settings for Production

1. In MongoDB Atlas Network Access, allow Vercel access:
    - Quick test: `0.0.0.0/0`
    - Better: restrict to required IP ranges when possible
2. Ensure Atlas database user credentials in `DATABASE_URL` are correct.

## Common Issues

- `querySrv ECONNREFUSED` on Atlas: Node DNS SRV resolver issue. Set `DNS_SERVERS=8.8.8.8,1.1.1.1`.
- Atlas connection refused: add your public IP in Atlas Network Access.
- Auth errors: verify `JWT_SECRET` exists in backend `.env`.
