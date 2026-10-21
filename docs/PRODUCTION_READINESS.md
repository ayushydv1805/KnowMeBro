# Production readiness and release checklist

This checklist separates automated repository checks from checks that require access to the live services.

## Automated checks

The `Production readiness` GitHub Actions workflow runs on pull requests and pushes to `main`, and weekly. It installs the dependency tree, fails on high-severity npm audit findings, runs the regression tests, builds the production bundle, and runs CodeQL static analysis. Dependabot proposes updates to npm dependencies and GitHub Actions.

## Required before a production release

- [ ] Confirm the Supabase project is active and the intended billing/usage settings are acceptable.
- [ ] Apply and verify all required migrations against a non-production environment first.
- [ ] Inspect every exposed table for row-level security and least-privilege grants.
- [ ] Review each public RPC function, especially `SECURITY DEFINER` functions: validate inputs, confirm only intended fields are returned, check creator-token ownership checks, and explicitly review `EXECUTE` grants.
- [ ] Run an end-to-end smoke test with a disposable quiz: create it, open the public friend link in a separate session, submit an attempt, resume progress, and load creator-only results with and without the creator token.
- [ ] Verify the deployed site on mobile and desktop, including light/dark themes, keyboard navigation, dialogs, CSV export, and PNG recap downloads.
- [ ] Verify Vercel/alternate-host build output and environment settings without placing secret keys in frontend code.
- [ ] Check the latest GitHub Actions run and resolve any audit or CodeQL findings before deployment.

## Dependency lockfile note

The repository currently does not commit `package-lock.json`. The workflow audits the dependency tree produced during its install, but that install can resolve newer compatible package versions on later runs. For reproducible installs, generate a lockfile in an environment with npm registry access, review it, commit it, and then switch CI from `npm install` to `npm ci`. Do not hand-write or guess transitive package versions or integrity hashes.

## Live-service validation note

Automated tests do not prove database permissions, RPC behavior, or a deployed browser flow. Earlier work reported the configured Supabase project as inactive and the connected Vercel deployment-list request as unauthorized. Those service checks must be completed with authorized access before claiming the entire production release has been verified.
