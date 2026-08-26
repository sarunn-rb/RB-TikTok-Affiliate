# Rabbit Bytes Creator Connect

Production-oriented proof of concept for TikTok Shop Public App Review. The application lets an authenticated reviewer connect one seller account, search TikTok Shop Creator Marketplace, create or retrieve one affiliate conversation, and send one message to the selected creator.

The project intentionally does not include bulk messaging, scraping, background jobs, fake analytics, or a database.

## Stack

- Next.js 16.3 with App Router
- JavaScript
- Tailwind CSS 4 plus project UI primitives
- Encrypted HTTP-only cookie sessions using JWE (`A256GCM`)
- Server-only TikTok Shop Open API client with HMAC-SHA256 signing
- Vercel-compatible deployment

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment template:

   ```bash
   cp .env.example .env.local
   ```

3. Fill every required value and use a `SESSION_SECRET` of at least 32 random characters.

4. Start the application:

   ```bash
   npm run dev
   ```

5. Open `http://localhost:3000` and sign in with `REVIEW_USER` / `REVIEW_PASSWORD`.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `REVIEW_USER` | Yes | Reviewer application username |
| `REVIEW_PASSWORD` | Yes | Reviewer application password |
| `SESSION_SECRET` | Yes | Encrypts all temporary application sessions; minimum 32 characters |
| `TIKTOK_SHOP_APP_KEY` | Yes | TikTok Shop application key |
| `TIKTOK_SHOP_APP_SECRET` | Yes | TikTok Shop application secret; server only |
| `TIKTOK_SHOP_SERVICE_ID` | Yes | Seller authorization service ID from Partner Center |
| `TIKTOK_SHOP_REDIRECT_URI` | Yes | Registered callback URI |
| `TIKTOK_SHOP_MARKET` | Yes | `ROW` or `US`; determines the seller authorization domain |

`TIKTOK_SHOP_SERVICE_ID` is intentionally separate from `TIKTOK_SHOP_APP_KEY`. Current TikTok Shop seller authorization URLs require `service_id`, while business API calls require `app_key`.

## TikTok Shop OAuth setup

Configure this exact production Redirect URL in TikTok Shop Partner Center:

```text
https://rb-tiktok-affiliate.vercel.app/api/tiktok/callback
```

The authorization flow is:

1. `/api/tiktok/authorize` creates a cryptographically random, encrypted, single-use OAuth state cookie.
2. The seller is redirected to the US or ROW TikTok Shop authorization domain with `service_id` and `state`.
3. `/api/tiktok/callback` validates the state and exchanges `code` using `grant_type=authorized_code`.
4. The app calls `GET /authorization/202309/shops` and stores all returned authorized shops and their ciphers with the token response. When more than one shop is returned, the reviewer can select the shop used by subsequent API calls.
5. Access tokens are refreshed server-side when close to expiry and a refresh token is present.

Configure only the scopes used by the current review build:

- **Shop Authorized Information** — retrieves the authorized shop and `shop_cipher`
- **Read Creator Marketplace** (`seller.creator_marketplace.read`) — searches Creator Marketplace
- **Manage Affiliate Messages** (`seller.affiliate_messages.write`) — creates one conversation and sends one seller-authored message

Do not include Product Basic, Promotion Information, Partner Campaign, Share Link, Showcase Product, Analytics, or Affiliate Collaboration scopes in this review build. Those workflows are not implemented.

## Vercel deployment

1. Import this repository into Vercel.
2. Add the environment variables from `.env.example` to the Production environment.
3. Set the Partner Center Redirect URL to the production callback shown above.
4. Deploy and wait for the deployment to reach `READY`.
5. Verify login, seller authorization, creator search, conversation creation, and one test message using a permitted real seller/test setup.

No secret belongs in the repository or in a `NEXT_PUBLIC_*` variable.

## Security notes

- Reviewer, OAuth state, and TikTok credentials use separate encrypted HTTP-only cookies.
- Cookies are `Secure` in production and `SameSite=Lax` for the OAuth redirect flow.
- TikTok API requests are made only on the server.
- App Secret, access token, refresh token, and reviewer password are never logged.
- API logs include only endpoint, TikTok request ID, business error code, message, and timestamp.
- Mutation routes verify same-origin requests and rate-limit accidental repeated requests.
- Logging out or disconnecting clears the temporary TikTok credential cookie.
- This no-database POC is designed for a short reviewer session, not long-term multi-tenant credential storage.

## Quality checks

```bash
npm run lint
npm run build
```

The primary visual reference is [`design/overview-concept.png`](design/overview-concept.png).

## Documentation

- [`docs/APP_REVIEW.md`](docs/APP_REVIEW.md)
- [`docs/PRD.md`](docs/PRD.md)
