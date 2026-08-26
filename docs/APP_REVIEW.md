# TikTok Shop App Review Submission Content

## Product Website URL

```text
https://rb-tiktok-affiliate.vercel.app
```

## Step-by-step Product Testing Instructions (496 characters)

> 1. Sign in with reviewer credentials. 2. Open Shop Connection, connect a TikTok Shop, and approve authorization. 3. Confirm the connected shop details. 4. Open Creators, search a keyword, and verify the TikTok request ID, Shop ID, sync time, and Creator Open ID. 5. Select Message creator, then click Create or retrieve conversation. 6. If a conversation ID appears, send one test message. Test accounts may instead return error 16030009 because TikTok Shop blocks affiliate messaging in sandbox.

## Brief List of Product Features

- Separate password-protected reviewer login without a user database
- TikTok Shop seller authorization with CSRF-safe OAuth state validation
- Secure temporary seller token and shop session in encrypted HTTP-only cookies
- Authorized shop information with masked shop cipher and token expiry status
- TikTok Shop Creator Marketplace search by username or keyword
- TikTok response provenance with endpoint, request ID, Shop ID, and synchronization time
- Creator Open ID display exactly as returned by TikTok Shop
- One-to-one affiliate creator conversation creation/retrieval
- One-to-one text affiliate messaging with double-submit prevention
- Reviewer-friendly TikTok business error handling
- In-product App Review testing guide

The application does not implement product or order synchronization, affiliate partner campaigns, promotion management, share links, showcase products, analytics, affiliate collaboration management, bulk messaging, automated outreach, creator scraping, schedulers, queues, or fake dashboard metrics.

## Current Review Scopes

- **Shop Authorized Information**
- **Read Creator Marketplace** (`seller.creator_marketplace.read`)
- **Manage Affiliate Messages** (`seller.affiliate_messages.write`)

No other scope is exercised by the current review build.

## Suggested Product Screenshots

1. **Shop Connection** — connected state with shop details and masked shop cipher
2. **Creator Search** — real Creator Marketplace search results with source endpoint, TikTok request ID, authorized Shop ID, synchronization time, and Creator Open ID
3. **Creator Messaging** — selected creator and either a `conversation_id` or the TikTok Shop test-account eligibility response with error code and request ID
