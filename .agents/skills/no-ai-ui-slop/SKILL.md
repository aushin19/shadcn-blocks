---
name: no-ai-ui-slop
description: Use when designing, generating, implementing, or reviewing web/mobile UI, dashboards, SaaS pages, product interfaces, or frontend components that risk looking generic, template-like, vibe-coded, or recognizably AI-generated.
---

# No AI UI Slop

## Overview

Create interfaces that feel authored for the product rather than assembled from popular AI/frontend defaults.

**Core principle:** premium UI comes from product-specific hierarchy, typography, spacing, semantics, and restraint — not extra gradients, glow, cards, or motion.

## Required Workflow

Before implementation, define:

1. **Product character** — e.g. technical, editorial, industrial, calm, playful, luxurious.
2. **Primary user task** — what must users notice or accomplish first.
3. **Hierarchy** — primary, secondary, tertiary, intentionally quiet.
4. **Visual system** — typography, spacing, shape, color, iconography, data display.
5. **Three product-specific decisions** — choices that would not transfer unchanged to an unrelated SaaS product.

Then implement the simplest structure that satisfies those decisions.

## Hard Rules

- Do not default to purple/indigo/cyan, gradients, glow, glass, bento, or dark “AI” styling.
- Do not wrap everything in cards or use one radius everywhere.
- Do not default to the canonical `centered hero → 3 cards → stats → testimonials → pricing → FAQ → CTA` page.
- Do not invent logos, testimonials, user counts, ratings, metrics, compliance claims, or “Most Popular” labels.
- Do not use generic AI/SaaS copy when specific product language is available.
- Do not decorate every heading/card with Lucide icons, emoji, sparkles, rockets, brains, wands, shields, or arrows.
- Do not add animation unless it explains state, space, causality, progress, or feedback.
- Do not add charts/KPIs that do not support a concrete user decision.
- Do not make AI products visually “AI” by default.
- Do not make developer tools look like fake terminal demos by default.

Patterns are not banned individually. **Unexamined defaults and stacked clichés are.**

## Quality Gate

Before completion, verify:

- Removing the logo would still leave clues about the product/domain.
- At least three design choices are product-specific.
- Layout is not unnecessarily card-heavy, centered, symmetric, or repetitive.
- Color and effects have a semantic or brand reason.
- Typography creates hierarchy before borders/shadows do.
- Buttons name actual actions and primary/secondary hierarchy is clear.
- Content is concrete and truthful.
- Loading, empty, error, success, disabled, permission, responsive, keyboard, and reduced-motion states are handled where relevant.
- Charts and metrics answer a real question.
- Decorative treatments can be defended individually.

If several checks fail, revise before presenting the UI as finished.

## Detailed Reference

Read `references/anti-slop-rules.md` when making visual decisions, reviewing a generated UI, or when the output still feels generic after the first pass. It contains the full anti-pattern catalog, exceptions, dashboard/landing-page/mobile guidance, and the detailed audit.

## Final Rule

Do not ask, “How do I make this look more designed?” and answer with effects.

Ask: **“What decisions make this interface uniquely right for this product?”**
