## 1. Prerequisites

- npm
- A Neon Postgres database URL
- API keys (Google AI, OpenWeather, AlphaVantage)
- OAuth apps (GitHub + Google) for login

## 2. Install

```bash
npm install
```

## 3. Environment Setup

Use these variables (in .env):

- `DATABASE_URL`: 
- `AUTH_SECRET`: 
- `GITHUB_ID`: 
- `GITHUB_SECRET`: 
- `GOOGLE_CLIENT_ID`: 
- `GOOGLE_CLIENT_SECRET`: 
- `GOOGLE_GENERATIVE_AI_API_KEY`: 
- `OPENWEATHER_API_KEY`: 
- `ALPHAVANTAGE_API_KEY`: 

## 4. Run Locally

```bash
npm run dev
```

App runs at `http://localhost:3000`.

## 5. OAuth Callback URLs

For local development, set callback URLs in GitHub/Google apps:

- `http://localhost:3000/api/auth/callback/github`
- `http://localhost:3000/api/auth/callback/google`