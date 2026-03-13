# Movie Watchlist Frontend

Modern React + Vite frontend for Movie Watchlist.

## Features

- Light and dark mode toggle
- Authentication UI (signup/login)
- Protected movie dashboard after login
- Movie CRUD (create, update, delete, list)
- Movie cards in responsive grid
- Movie details modal when card is clicked

## Tech Stack

- React
- Vite
- Native Fetch API

## Environment Variables

Create a `.env` file in `frontend/`:

```env
VITE_API_URL=http://localhost:5000
```

If not provided, the app defaults to `http://localhost:5000`.

## Local Development

From `frontend/`:

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Backend Contract (Used by Frontend)

Auth endpoints:

- `POST /auth/register`
- `POST /auth/login`

Movie endpoints (Bearer token required):

- `GET /movies`
- `GET /movies/:id`
- `POST /movies`
- `PUT /movies/:id`
- `DELETE /movies/:id`

## Deploy Frontend to Vercel

1. Push your repository to GitHub.
2. In Vercel, click **Add New Project** and import this repo.
3. Set **Root Directory** to `frontend`.
4. Framework Preset: **Vite**.
5. Deploy backend first from the same repo with **Root Directory** set to `backend`.
6. Add environment variable in frontend Vercel project:
    - `VITE_API_URL` = your deployed backend Vercel URL

7. Deploy frontend.

After deploy, frontend will call your backend via `VITE_API_URL`.
