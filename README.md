# Underhype.digital Admin Dashboard

A customised agency dashboard built on the MIT-licensed Shadcn Admin project.

## Current implementation

- Underhype blue brand palette and responsive shadcn/ui layout
- Staging environment indicator
- Cloudflare Access remains the authentication gateway
- Staging Worker API integration using same-origin requests and no-store caching
- Overview cards for contacts, hiring applications, new submissions and totals
- Contact enquiry and hiring application tables with search, status filters, pagination and details
- Secure resume downloads through the authenticated Worker endpoint
- CSV exports from the existing staging export API
- Analytics charts for trends, geography, service demand and hiring roles
- Archived-record view and restore actions
- Team access view with workspace-owner controls
- Light and dark themes

## Backend contract

The frontend expects these existing Worker routes:

- GET /api/admin/me
- GET /api/admin/overview
- GET /api/admin/analytics?range=7|30|90|365|all
- GET /api/admin/contacts
- GET /api/admin/hiring
- GET /api/admin/export
- GET /api/admin/archive
- POST /api/admin/archive
- POST /api/admin/restore
- GET /api/admin/resume?id=...

Team access UI uses existing /api/admin/users routes.

## Environment and security

This branch is a dashboard frontend development branch only. It does not deploy the Cloudflare Worker or alter production resources. All API requests are same-origin and intended to be served behind the existing Cloudflare Access policy.

The staging Worker has a deliberate read-only allowlist. Status updates and team writes are not enabled through the staging allowlist; controls must not be assumed to work until that policy is separately reviewed. Owner-only staging archive and restore routes are the only data-changing dashboard actions exposed by the current staging policy. Permanent deletion remains disabled.

Staging uses its own D1/R2 bindings:
- D1: underhype-preview
- R2: underhype-uploads-preview

Never point this frontend at production while testing.

## Local development

```bash
pnpm install
pnpm dev
```

To use the real staging API locally, requests need to be served through the staging Worker origin and Cloudflare Access session. Avoid adding credentials or database secrets to Vite environment variables.

## Build checks

```bash
pnpm build
pnpm lint
```
