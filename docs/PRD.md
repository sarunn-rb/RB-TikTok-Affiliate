# Rabbit Bytes Creator Connect — Product Requirements Document

## 1. Product Overview

Rabbit Bytes Creator Connect is a focused TikTok Shop Public App Review POC. It gives an authorized seller a simple, secure workflow to discover one affiliate creator, create or retrieve one conversation, and send one intentional affiliate message.

Short description: **Manage TikTok Shop creator outreach and affiliate collaboration workflows more efficiently.**

## 2. Business Purpose

Seller teams often move between creator discovery and outreach tools. This product demonstrates a legitimate seller-authorized integration through official TikTok Shop Open APIs while keeping the first release narrow enough for reviewers to verify. It does not automate or scale outreach.

## 3. Target Users

- TikTok Shop Public App Reviewers validating the submitted integration
- TikTok Shop sellers and affiliate operators who need a direct creator discovery and messaging workflow
- Rabbit Bytes staff supporting the review and approved seller onboarding

## 4. User Journey

```text
Reviewer login
→ Connect TikTok Shop seller
→ Search Creator Marketplace
→ Select one creator
→ Create or retrieve conversation
→ Send one affiliate message
```

No step permits selecting multiple recipients or scheduling automated outreach.

## 5. TikTok Shop Authorization Flow

1. The reviewer authenticates to Rabbit Bytes Creator Connect using environment-managed credentials.
2. The server generates an unpredictable OAuth state and stores it in an encrypted, HTTP-only, single-use cookie.
3. The seller is redirected to the official US or Rest-of-World seller authorization URL using the Partner Center `service_id`.
4. TikTok Shop returns a short-lived code and state to `/api/tiktok/callback`.
5. The server validates state and exchanges the code at `GET https://auth.tiktok-shops.com/api/v2/token/get` with `grant_type=authorized_code`.
6. The server calls `GET /authorization/202309/shops` to retrieve all authorized shop records, including each shop cipher. If multiple shops are returned, the reviewer selects which shop context subsequent API calls use.
7. Tokens, expiry timestamps, granted scopes, and selected shop data are stored temporarily in an encrypted HTTP-only cookie.
8. A near-expiry access token is refreshed server-side through `/api/v2/token/refresh` when a valid refresh token is available.

Local and cross-border sellers use the shop returned by the authorization response. No shop ID or cipher is hardcoded.

## 6. Creator Discovery

Route: `/creators`

The seller enters a creator username or keyword. The server calls:

```text
POST /affiliate_seller/202505/marketplace_creators/search
```

The UI displays only fields returned by TikTok Shop, such as avatar, username, display name, Creator Open ID, followers, category, and region. Exact username lookup is not claimed; the UI explains that matches follow TikTok Shop's supported keyword search behavior.

## 7. Affiliate Creator Messaging

Route: `/messages`

Conversation creation/retrieval:

```text
POST /affiliate_seller/202508/conversations
{
  "creator_open_id": "...",
  "only_need_conversation_id": true
}
```

Text message sending:

```text
POST /affiliate_seller/202412/conversations/{conversation_id}/messages
{
  "msg_type": "TEXT",
  "content": "{\"content\":\"...\"}"
}
```

The different endpoint versions are intentional and match their respective TikTok Shop API reference pages. The send button is disabled while a request is running, input is length-limited, and server-side rate protection reduces accidental duplicate sends.

## 8. Affiliate Collaboration

The review POC includes a scope-aware availability page but does not fabricate collaboration records or enable incomplete mutations. By default, it displays:

```text
Affiliate Collaboration API is not enabled for this application.
```

The optional feature remains disabled until Partner Center approval and exact product, commission, date, creator, contact, and sample-rule inputs required by `POST /affiliate_seller/202508/target_collaborations` are configured and tested.

## 9. API Scope Mapping

| Scope | Feature | Endpoint(s) | Why required |
| --- | --- | --- | --- |
| Seller authorization / authorized shop access configured for the app | Shop connection | `GET /authorization/202309/shops` | Retrieves seller-authorized shops and the correct `shop_cipher` after token exchange |
| `seller.creator_marketplace.read` | Creator discovery | `POST /affiliate_seller/202505/marketplace_creators/search` | Searches Creator Marketplace for seller-selected matching creators |
| `seller.affiliate_messages.write` | Create/retrieve creator conversation | `POST /affiliate_seller/202508/conversations` | Starts or retrieves one seller-to-creator affiliate conversation |
| `seller.affiliate_messages.write` | Send one affiliate message | `POST /affiliate_seller/202412/conversations/{conversation_id}/messages` | Sends seller-authored text to the selected creator |
| `seller.affiliate_collaboration.read` | Optional collaboration read availability | Approved seller collaboration read endpoint(s) only | Requested only when a reviewed collaboration-read workflow is enabled |
| `seller.affiliate_collaboration.write` | Optional target collaboration creation | `POST /affiliate_seller/202508/target_collaborations` | Requested only when creation inputs and approved workflow are enabled |

No finance, fulfillment, logistics, customer-service buyer messaging, live-data, or bestseller scopes are required.

## 10. Data Flow

```mermaid
flowchart LR
    Seller --> App[Creator Connect]
    Reviewer --> App
    App --> TikTokOAuth[TikTok Shop OAuth]
    TikTokOAuth --> App
    App --> Session[Encrypted HTTP-only session]
    App --> TikTokShopAPI[TikTok Shop Open API]
    TikTokShopAPI --> CreatorMarketplace[Creator Marketplace]
    TikTokShopAPI --> AffiliateMessaging[Affiliate Messaging]
    TikTokShopAPI -. only when approved .-> AffiliateCollaboration[Affiliate Collaboration]
```

The browser never calls TikTok Shop directly. It sends validated requests to the Next.js server, which retrieves the encrypted session, refreshes the token if required, signs the exact path/query/body bytes, and calls TikTok Shop.

## 11. Security and Privacy

- Review authentication uses environment variables and an encrypted HTTP-only cookie; no user database is present.
- Reviewer session, TikTok credential session, and OAuth state use separate JWE-encrypted cookies.
- Production cookies are Secure and use `SameSite=Lax` for the seller authorization callback.
- OAuth state is random, validated, short-lived, and single-use.
- App secret, access token, refresh token, and reviewer password never enter the browser bundle or API response.
- Mutating API routes enforce same-origin requests.
- Search, conversation creation, message send, and login endpoints have basic per-instance rate protection.
- Logging out clears all temporary sessions; disconnecting clears the TikTok credential session.
- No TikTok credentials are stored in `localStorage` or committed to Git.

## 12. Error Handling

TikTok Shop responses are mapped to reviewer-friendly guidance. Eligibility, quota, privacy, and region errors are returned once and not automatically retried. Important handled codes include `16030002`, `16030003`, `16030007`, `16030009`, `16030100`, `16030101`, `16032001`, `45101004`, and `45101021`.

Each TikTok API result is logged server-side with only:

```text
endpoint
request_id
TikTok business error code
error message
timestamp
```

Secrets, tokens, and reviewer passwords are excluded.

## 13. Deployment Architecture

- Vercel hosts the Next.js application and server route handlers.
- Vercel environment variables hold reviewer and TikTok Shop credentials.
- No external database, queue, worker, or scheduler is used.
- TikTok Shop authorization, token, and business API hosts remain separate according to official documentation.
- Temporary session cookies fit the short Public App Review use case. A later multi-tenant release would require durable encrypted server-side credential storage and explicit retention controls.
