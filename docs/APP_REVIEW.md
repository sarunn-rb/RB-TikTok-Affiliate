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
6. Review the Creator Marketplace matches returned by TikTok Shop. Click **Message creator** for one result.
7. On **Messages**, confirm the selected Creator Open ID and click **Create or retrieve conversation**.
8. Confirm that a `conversation_id` is displayed, enter one test affiliate message, and click **Send message** once.
9. Confirm the success result or the reviewer-friendly TikTok Shop eligibility response. TikTok Shop test accounts may return error `16030009` because test accounts cannot send affiliate messages.
10. Open **Collaborations**. If collaboration scopes are not enabled, the app truthfully states that the Affiliate Collaboration API is not enabled.

## Brief List of Product Features

- Separate password-protected reviewer login without a user database
- TikTok Shop seller authorization with CSRF-safe OAuth state validation
- Secure temporary seller token and shop session in encrypted HTTP-only cookies
- Authorized shop information with masked shop cipher and token expiry status
- TikTok Shop Creator Marketplace search by username or keyword
- One-to-one affiliate creator conversation creation/retrieval
- One-to-one text affiliate messaging with double-submit prevention
- Reviewer-friendly TikTok business error handling
- Scope-aware collaboration availability screen
- In-product App Review testing guide

The application does not implement bulk messaging, automated outreach, creator scraping, schedulers, queues, campaign analytics, or fake dashboard metrics.

## Suggested Product Screenshots

1. **Shop Connection** — connected state with shop details and masked shop cipher
2. **Creator Search** — real Creator Marketplace search results
3. **Creator Messaging** — selected creator, `conversation_id`, message field, and success/error result

Do not submit an Affiliate Collaboration screenshot unless the application has been granted the relevant collaboration scope and that reviewer account can exercise the approved workflow.
