# Security Policy

## Reporting a vulnerability

Please do not publish exploitable details, credentials, or private user data in a public issue. Use the repository's **Security** tab and its private vulnerability-reporting option when available. If private reporting is not enabled, contact the repository maintainer privately before sharing technical details publicly.

Include the affected area, impact, reproducible steps, and any practical mitigation. Do not include real friend names, creator tokens, or production data in a report.

## Security expectations for contributors

- Never commit Supabase secret or `service_role` keys, access tokens, passwords, or production exports. The browser-facing publishable key is not a substitute for database authorization.
- Keep private creator results behind the creator-token check in the database RPC; do not expose answer keys through the public quiz RPC.
- Review every `SECURITY DEFINER` function's body and execute grants, and verify row-level security for exposed tables before changing database permissions.
- Treat text entered by friends as untrusted data, including values written into downloadable CSV files.
- Do not reactivate a paused database or change production permissions solely to run a test without confirming the cost and scope first.
