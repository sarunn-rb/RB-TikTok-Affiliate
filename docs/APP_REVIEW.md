# TikTok Shop App Review Submission Content

## Product Website URL

```text
https://rb-tiktok-affiliate.vercel.app
```

## Step-by-step Product Testing Instructions

1. Open the Product Website URL and sign in using the reviewer username and password supplied in the confidential review fields.
2. Open **Shop Connection** and click **Connect TikTok Shop**.
3. Sign in to an eligible TikTok Shop seller account and approve the application authorization request.
4. Confirm that the app returns to **Shop Connection** and displays the authorized shop name, market, seller type when returned, a masked shop cipher, and token expiry time when returned.
5. Open **Creators**. Enter a TikTok creator username or keyword and click **Search creators**.
6. Confirm the source panel shows the exact TikTok endpoint, TikTok `request_id`, authorized Shop ID, and synchronization time.
7. Review the Creator User ID when returned by TikTok Shop and the Creator Open ID used for affiliate messaging. The app never fabricates a missing identifier.
8. Click **Message creator** for one result.
9. On **Messages**, confirm the selected Creator Open ID and click **Create or retrieve conversation**.
10. Confirm that a `conversation_id` is displayed, enter one test affiliate message, and click **Send message** once.
11. Confirm the success result or the reviewer-friendly TikTok Shop eligibility response. TikTok Shop test accounts may return error `16030009` because test accounts cannot send affiliate messages.

## Brief List of Product Features

- Separate password-protected reviewer login without a user database
- TikTok Shop seller authorization with CSRF-safe OAuth state validation
- Secure temporary seller token and shop session in encrypted HTTP-only cookies
- Authorized shop information with masked shop cipher and token expiry status
- TikTok Shop Creator Marketplace search by username or keyword
- TikTok response provenance with endpoint, request ID, Shop ID, and synchronization time
- Separate Creator User ID and Creator Open ID display when returned by TikTok Shop
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
2. **Creator Search** — real Creator Marketplace search results with source endpoint, TikTok request ID, authorized Shop ID, synchronization time, Creator User ID when returned, and Creator Open ID
3. **Creator Messaging** — selected creator, `conversation_id`, message field, and success/error result
