# 🚀 Sales Frontend Application

A production-ready Next.js frontend application for the Sales platform with secure API authentication.

## 🔑 Features

- 🧑‍💻 Framework: Next.js 15 with App Router
- 🧪 Testing: Vitest (unit) + Playwright (e2e)
- 🧹 Linting: Biome
- 🧾 Typing: TypeScript
- 🔐 API Authentication: Secure API key integration
- 🚦 CI/CD: GitHub Actions
- 🧩 Commit Style: Conventional Commits
- 🚀 Release: Semantic Release
- 📦 Package Manager: pnpm

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm installed globally
- API key from the backend team

### Environment Setup

1. **Copy the environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Configure environment variables in `.env.local`:**
   ```env
   NEXT_PUBLIC_API_URL="https://sales-backend-python.onrender.com"
   API_KEY="your-api-key-here"
   ```

3. **Obtain an API Key:**
   - Contact the backend team (repository: `Tornike512/sales-backend-python`)
   - The API key is required for all backend API requests
   - **IMPORTANT:** Never commit your `.env.local` file with real API keys

### Installation

```bash
pnpm install
pnpm dev
```

---

## 📦 Scripts

| Command | Description |
|--------|-------------|
| `pnpm dev` | Run the dev server |
| `pnpm build` | Build the app |
| `pnpm lint` | Run Biome (lint + format) |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm test` | Run unit tests with Vitest |
| `pnpm test:e2e` | Run E2E tests with Playwright |
| `pnpm release` | Trigger Semantic Release (usually via CI) |

---

## 🧪 Testing

### Unit Tests
```bash
pnpm test
```

### E2E Tests
```bash
pnpm test:e2e
```

To install Playwright browsers for CI:
```bash
pnpm test:e2e:install:ci
```

---

## ✅ Git Commit Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/) + commitlint.

Example:

```bash
git commit -m "feat(auth): add login flow (#123)"
```

> Make sure to include the task ID in your commit message if using Jira.

---

## 🔄 Releases

We use [Semantic Release](https://semantic-release.gitbook.io/semantic-release/) for automated versioning and changelogs.

### To manually trigger a release (locally or CI):
```bash
pnpm release
```

> Releasing is automatically triggered on `main` via GitHub Actions.

---

## 🔧 GitHub Actions CI

- ✅ Linting (Biome)
- ✅ TypeScript type checking
- ✅ Vitest tests
- ✅ Playwright tests
- ✅ Semantic release (on push to `main`)
- ✅ Deploy (optional)

Check `.github/workflows/` for full config.

---

## 🧩 Project Structure (example)

```
.
├── apps/
│   └── dashboard/           # Main app
├── packages/
│   └── ui/                  # Shared component lib
├── .github/
│   └── workflows/           # CI config
├── .biome.json              # Biome config
├── vitest.config.ts         # Vitest config
├── playwright.config.ts     # Playwright config
└── package.json
```

---

## 🛡️ Security

### API Authentication

This application uses API key authentication to secure backend requests:

- **API keys are server-side only** - Never exposed in client-side code
- **Stored in environment variables** - Never committed to Git
- **Included in X-API-Key header** - Automatically added by the API client
- **Request validation** - Backend validates all requests

### Security Best Practices

- ✅ API keys stored in `.env.local` (gitignored)
- ✅ Server-side API calls with authentication
- ✅ Error handling for authentication failures
- ✅ Rate limiting protection
- ✅ Biome security checks
- ✅ Playwright E2E auth flows

### Environment Variables

| Variable | Description | Required | Exposed to Client |
|----------|-------------|----------|-------------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | Yes | Yes |
| `API_KEY` | API authentication key | Yes | No (server-only) |

**⚠️ IMPORTANT:** 
- Never prefix `API_KEY` with `NEXT_PUBLIC_` as it would expose it to the client
- Keep your API key secure and rotate it regularly
- Contact the backend team to obtain or rotate API keys

---

## 🔧 API Integration

### API Client

The application uses a centralized API client ([src/lib/api-client.ts](src/lib/api-client.ts)) that:

- Automatically adds authentication headers
- Handles authentication errors (403 Forbidden)
- Handles rate limiting (429 Too Many Requests)
- Provides type-safe request methods
- Logs errors for debugging

### Usage Example

```typescript
import { api } from '@/lib/api-client';

// GET request
const products = await api.get('/api/v1/products', {
  params: {
    store_name: 'europroduct',
    sort: 'discount_percent_desc',
    limit: 16,
    offset: 0
  }
});

// POST request
const result = await api.post('/api/v1/auth/login', {
  email: 'user@example.com',
  password: 'password'
});
```

### Error Handling

The API client automatically handles common errors:

```typescript
try {
  const data = await api.get('/api/v1/products');
} catch (error) {
  if (error instanceof ApiError) {
    if (error.status === 403) {
      // Authentication failed - check API key
      console.error('Invalid API key');
    } else if (error.status === 429) {
      // Rate limit exceeded
      console.error('Too many requests. Try again later.');
    }
  }
}
```

---

## 🚨 Troubleshooting

### Common Issues

#### 1. Authentication Errors (403 Forbidden)

**Symptom:** API requests fail with "Authentication failed" error

**Solutions:**
- Verify `API_KEY` is set in `.env.local`
- Contact backend team to verify API key is valid
- Check if API key has been revoked or expired
- Ensure you're not trying to use API key on client-side

**Check:**
```bash
# Verify environment variable is loaded
echo $API_KEY  # Should not be empty
```

#### 2. Rate Limiting (429 Too Many Requests)

**Symptom:** API requests fail with "Too many requests" error

**Solutions:**
- Wait for the retry period (check error message for duration)
- Implement request caching to reduce API calls
- Optimize your queries to fetch less frequently
- Contact backend team to discuss rate limit increases

#### 3. CORS Errors

**Symptom:** Browser console shows CORS policy errors

**Solutions:**
- Verify `NEXT_PUBLIC_API_URL` matches the backend URL
- Ensure backend has your domain in CORS whitelist
- For local development, backend should allow `http://localhost:3000`
- Contact backend team to add your production domain

#### 4. Network Errors

**Symptom:** "Network error" or fetch failures

**Solutions:**
- Check internet connection
- Verify backend API is running and accessible
- Check backend status at: https://sales-backend-python.onrender.com/health
- Try accessing API URL directly in browser

#### 5. Environment Variables Not Loading

**Symptom:** `API_KEY` or `NEXT_PUBLIC_API_URL` undefined

**Solutions:**
- Ensure `.env.local` file exists in project root
- Restart development server after changing environment variables
- Verify no typos in variable names
- Check `.env.local` is not gitignored (it should be)

**Verify setup:**
```bash
# Check if .env.local exists
ls -la .env.local

# Restart dev server
pnpm dev
```

---

## 📚 API Documentation

### Backend Repository
- Repository: [Tornike512/sales-backend-python](https://github.com/Tornike512/sales-backend-python)
- API Base URL: `https://sales-backend-python.onrender.com`

### Available Endpoints

#### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/forgot-password` - Password reset request
- `POST /api/v1/auth/reset-password` - Password reset confirmation
- `POST /api/v1/auth/verify` - Token verification

#### Products
- `GET /api/v1/products` - Get products list
- Query parameters:
  - `store_name`: Filter by store
  - `sort`: Sort order (e.g., `discount_percent_desc`)
  - `limit`: Results per page
  - `offset`: Pagination offset

#### Categories
- `GET /api/v1/categories` - Get categories list

#### Cart
- `GET /api/v1/cart` - Get user cart
- `POST /api/v1/cart` - Add item to cart
- `PUT /api/v1/cart/{id}` - Update cart item
- `DELETE /api/v1/cart/{id}` - Remove cart item
- `DELETE /api/v1/cart` - Clear cart

---

## 🚀 Deployment

### Environment Variables on Hosting Platform

When deploying to Render.com, Vercel, or other platforms:

1. **Add environment variables in platform settings:**
   - `NEXT_PUBLIC_API_URL` = `https://sales-backend-python.onrender.com`
   - `API_KEY` = `[Your production API key]`

2. **Render.com specific:**
   - Go to Dashboard → Your Service → Environment
   - Add environment variables
   - Trigger manual deploy or wait for auto-deploy

3. **Vercel specific:**
   - Go to Project Settings → Environment Variables
   - Add variables for Production, Preview, and Development
   - Redeploy to apply changes

### CORS Configuration

Ensure your production domain is whitelisted in the backend CORS configuration. Contact the backend team with your domain:
- Production: `https://your-domain.com`
- Preview/Staging: `https://preview.your-domain.com`

---

## 🔐 API Key Management

### Obtaining an API Key

1. Contact the backend team (repository: `Tornike512/sales-backend-python`)
2. Provide your name, email, and intended use
3. You will receive an API key via secure channel
4. Add it to your `.env.local` file

### Rotating API Keys

For security, rotate API keys periodically:

1. Request new API key from backend team
2. Update `.env.local` with new key
3. Test locally before deploying
4. Update production environment variables
5. Notify backend team to revoke old key

### Revoking API Keys

If your API key is compromised:

1. Immediately notify the backend team
2. Request key revocation
3. Obtain a new API key
4. Update all environments

---

## 🛡️ Security

### Security Best Practices

- ✅ API keys stored in `.env.local` (gitignored)
- ✅ Server-side API calls with authentication
- ✅ Error handling for authentication failures
- ✅ Rate limiting protection
- ✅ Biome security checks
- ✅ Playwright E2E auth flows
- 🔒 Consider adding Snyk or CodeQL for deeper security scans

---

## 📋 Changelog

Maintained by `semantic-release` in [`CHANGELOG.md`](./CHANGELOG.md)

---

## 📦 Versioning

Semantic release automatically:
- Bumps version based on commit history
- Updates `CHANGELOG.md`
- Creates GitHub release

---

## 🧠 License

MIT © [Your Name or Team]
