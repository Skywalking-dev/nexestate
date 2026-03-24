# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Common Changelog](https://common-changelog.org/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Brand identity: PRODUCT_IDENTITY.md, logo SVG (light/dark), favicon, OG template (SKY-214)
- Design tokens: Tailwind config, font preload (Plus Jakarta + Inter), CSS custom properties
- CWV baseline audit with WCAG AA contrast validation (SKY-217)
- Next.js 15 App Router scaffold with TypeScript strict (SKY-205)
- Supabase schema: organizations, members, crm_connections with RLS policies
- Supabase auth: magic link flow, requireAuth/requireAdmin helpers
- Upstash Redis client + sliding window rate limiter
- Zod validation schemas for all base entities
- Tokko API client with validateConnection, getProperties, getContacts (SKY-206)
- AES-256-GCM encryption for CRM API keys
- CRM API routes: POST /api/crm/connect, GET /api/crm/status, DELETE /api/crm/disconnect
- CRM settings page at /configuracion with connect form + status display
- Base UI components: Button, Input, Card with data-testid
- Dashboard layout with sidebar navigation (6 items)
- Login page with magic link form
- Vercel deploy config with security headers + Sentry monitoring
- Error boundaries (app + root level)
- DEPLOY.md deployment guide

### Changed

- Stack: FastAPI → Next.js full-stack (Vercel). Jobs pesados → n8n
- PRD: redistribucion de niveles (match+scoring → MVP, video+mapas → Fase 2)
- DB schema: api_key_encrypted BYTEA → TEXT, sync_status expanded with active/disconnected
- Nombre confirmado: NexEstate. Tagline: "Tu inmobiliaria, potenciada."
- Paleta: azul marino #1A2B4D + cobre #B8832A (reemplaza oro)
