# Anti-Slop Design Rules

## Overview

Create interfaces that feel intentionally designed for the product, not statistically averaged from popular component libraries and AI-generated SaaS examples.

**Core principle:** premium UI comes from product-specific decisions, hierarchy, restraint, and coherence — not from adding more gradients, cards, glow, motion, or decoration.

The goal is **not** to ban modern UI patterns. The goal is to prevent unexamined defaults. A card, gradient, pill, Lucide icon, dark theme, bento grid, or glass effect is acceptable only when it serves the product and fits a deliberate visual system.

## When to Use

Use this skill for:

- landing pages, marketing sites, SaaS products
- dashboards, admin panels, analytics tools, SOC/security interfaces
- mobile apps and responsive web apps
- design systems and component libraries
- AI-generated or AI-assisted frontend work
- redesigns where the current UI feels generic or template-like
- reviews where someone says “this looks AI-generated”, “vibe-coded”, “too shadcn”, “too generic”, or “not premium”

Do not use this skill to erase a product's intentional brand language simply because it uses a currently popular pattern.

## Non-Negotiable Design Standard

Before implementation, establish these five things:

1. **Product character** — What should this product feel like? Precise, editorial, industrial, playful, technical, calm, luxurious, utilitarian, etc.
2. **Primary user task** — What must the user notice or accomplish first?
3. **Visual hierarchy** — What is primary, secondary, tertiary, and intentionally quiet?
4. **Distinctive system** — Typography, spacing, shape, color, iconography, and data visualization must form a coherent product-specific language.
5. **Restraint rule** — Every decorative treatment must justify itself. If removing it improves clarity, remove it.

If these are undefined, do not compensate with trendy styling.

# Anti-Slop Rules

## 1. Never Default to “AI Purple”

Avoid choosing purple, violet, indigo, cyan, or blue-purple gradients merely because the interface is technical, SaaS, or AI-related.

Do not default to:

- violet primary buttons
- blue → purple gradients
- purple → pink gradients
- gradient headline text
- purple glow behind hero content
- cyan/purple neon on dark navy
- multicolor gradient borders

Use these only when supported by the brand or product meaning.

**Preferred behavior:** derive a restrained palette from brand, content, environment, or semantic function. One intentional accent is usually stronger than five decorative accents.

## 2. Prevent Cardocalypse

Do not wrap every piece of information in a card.

Avoid:

- cards inside cards
- KPI cards inside a larger card
- filter bars inside cards without need
- table-in-card-in-panel nesting
- every section becoming a rounded rectangle
- identical cards for unrelated content types
- using elevation merely to separate everything

Prefer:

- whitespace
- alignment
- dividers
- section rhythm
- typography
- table structure
- grouped surfaces only where containment matters

A surface should communicate grouping, interaction, state, or hierarchy — not merely decorate content.

## 3. Stop Using One Radius Everywhere

Avoid making every button, input, modal, panel, chip, card, and image `rounded-2xl`, `rounded-3xl`, or `rounded-full`.

Define a small radius system with purpose:

- controls
- containers
- overlays
- pills/chips only when the semantics genuinely fit a pill

Shape is part of identity. Treat it deliberately.

## 4. Do Not Use the Canonical AI Landing-Page Skeleton by Default

Never automatically assemble:

`Navbar → centered hero → announcement pill → two CTAs → logo wall → 3 feature cards → bento → stats → testimonials → pricing → FAQ → giant CTA → footer`

Choose page structure from the product story and decision journey.

Also avoid:

- centered everything
- exactly three feature cards because “three looks good”
- exactly six features in a 3×2 grid
- perfect symmetry in every section
- identical vertical spacing for every section
- every section constrained to the same max width

Use asymmetry, density changes, editorial pacing, or task-driven structure when appropriate.

## 5. Hero Sections Must Say Something Specific

Avoid the generic hero recipe:

- small “Introducing” / “New” pill
- giant centered heading
- one gradient word
- vague subheading
- primary + secondary pill CTA
- fake social proof row
- floating screenshot with glow

Do not write empty claims such as:

- Supercharge your workflow
- Unlock your potential
- Elevate your experience
- Transform the way you work
- Reimagine productivity
- Seamlessly automate everything
- Built for the future
- One platform, endless possibilities
- Everything you need
- Work smarter, not harder

Write product-specific copy with concrete nouns, actions, outcomes, and constraints.

## 6. No Fake Trust Signals

Never invent:

- customer logos
- user counts
- review scores
- testimonials
- revenue metrics
- uptime claims
- avatar piles
- “Trusted by 10,000+ teams”
- “Most Popular” pricing labels without evidence
- fabricated security/compliance badges

If real proof is unavailable, omit social proof or use truthful product evidence.

## 7. Typography Must Be a System, Not a Default

Inter, Geist, Roboto, system-ui, Poppins, and similar fonts are not forbidden. Using them without typographic intent is.

Avoid:

- one font weight for body and one for everything else
- giant 64–80px SaaS headings by default
- random serif italics to fake an editorial feel
- all-caps micro-labels everywhere
- arbitrary keyword capitalization
- tiny low-contrast gray body copy
- identical typography across marketing, data, controls, and code

Define:

- display style
- section heading scale
- body scale
- labels/captions
- numeric/data style
- monospace role, if any
- line-height and measure

Typography should create hierarchy before borders and shadows do.

## 8. Icons Must Communicate, Not Decorate

Avoid:

- Lucide icon on every card
- icon-in-rounded-square repeated everywhere
- giant decorative icon above every heading
- Sparkles for anything involving AI
- Zap for speed by reflex
- Rocket for growth
- Brain for AI
- Wand for automation
- Shield for every security feature
- ArrowRight on every link
- emojis as primary interface icons
- mixed icon styles and stroke weights

Lucide and other libraries are fine when icons are selected for actual meaning and used consistently.

If text alone is clearer, omit the icon.

## 9. Buttons Should Reflect Action Hierarchy

Avoid:

- every button being a pill
- gradient buttons by default
- oversized CTAs everywhere
- icon + label for trivial actions
- multiple “primary” actions competing visually
- generic labels such as `Get Started`, `Learn More`, or `Explore` when a specific action is possible

Prefer verbs that name the actual outcome:

- `Create alert rule`
- `Review packet`
- `Compare plans`
- `Export report`
- `Start analysis`

Use one clear primary action per local decision context.

## 10. Motion Must Explain Change

Do not add animation merely to make a page feel premium.

Avoid:

- fade-up on every section
- stagger animation on every grid
- hover-scale on every card
- glowing orb loops
- floating screenshots
- endless gradient movement
- automatic count-up metrics
- decorative parallax
- unnecessary spring physics
- scroll hijacking
- typewriter effects without purpose

Use motion for:

- state transitions
- spatial continuity
- causality
- progress
- feedback
- orientation

Respect reduced-motion preferences.

## 11. Dashboards Must Serve Decisions

Never default to:

`Greeting → 4 KPI cards → line chart → donut chart → recent activity`

Avoid:

- arbitrary four-card KPI rows
- green `+12.5%` everywhere
- meaningless sparklines
- decorative donut charts
- gauges without a decision threshold
- “Live” badges on obviously live data
- fake operational metrics
- random AI confidence scores
- excessive status dots
- charts selected because they fill space

For every metric or chart, ask:

- What decision does this support?
- Compared with what?
- Over what time window?
- What is normal vs abnormal?
- What action follows?

If the answer is unclear, redesign or remove it.

## 12. Pricing Must Reflect Packaging Logic

Do not automatically create three equal pricing columns with a highlighted middle tier.

Avoid reflexive patterns such as:

- Free / Pro / Enterprise
- “Most Popular” badge
- monthly/yearly toggle
- “Save 20%” chip
- endless checkmark lists

Use the actual business model, buyer decision, limits, and differentiation.

## 13. AI Products Do Not Need to Look Like “AI”

Avoid default AI symbolism:

- sparkles everywhere
- glowing orb assistants
- purple robots
- magic wands
- particle fields
- glowing brains
- gradient response borders
- “AI is thinking...” theatrics
- fake AI confidence meters
- six generic prompt suggestion cards

Design around the user's job, not the existence of the model.

## 14. Developer Tools Do Not Need a Fake Terminal Hero

Avoid defaulting to:

- fake macOS window dots
- `$ npm install ...`
- fake syntax-highlighted commands
- terminal inside a glowing card
- “Ship 10x faster”
- cyan/green monospace text purely for developer vibes

Show real workflows, architecture, output, diffs, traces, or product interaction instead.

## 15. Decorative Effects Must Earn Their Place

Treat these as opt-in, not default:

- glassmorphism
- bento grids
- mesh gradients
- aurora backgrounds
- background blobs
- glow
- noise textures
- oversized shadows
- 1px translucent borders everywhere

These are not inherently bad. They become slop when used as generic beautification without product-specific reasoning.

# UX Quality Rules

Visual polish cannot compensate for weak interaction design.

Always handle:

- loading
- empty
- error
- success
- disabled
- permission denied
- offline / degraded states when relevant
- destructive confirmation
- keyboard focus
- hover/focus/pressed distinction
- responsive layout
- long text and overflow
- realistic data density

Avoid:

- tiny tap targets
- unlabeled icon-only controls
- hidden primary actions
- three-dot menus for frequently used actions
- modal-on-modal interaction
- desktop tables merely shrunk onto mobile
- toggles where checkbox/radio/select is semantically clearer
- weak contrast
- nonstandard controls without benefit
- fake interactivity

Accessibility is part of premium quality, not a cleanup step.

# Product-Specific Design Requirement

Before finishing, identify at least **three product-specific design decisions** that would not automatically transfer to an unrelated SaaS product.

Examples:

- threat severity hierarchy tailored to a SOC
- timeline density optimized for incident investigation
- visual treatment derived from an industrial device environment
- finance-specific numeric typography and comparison behavior
- healthcare workflow optimized around review/approval states
- developer-tool interaction built around diffs and execution state

If the logo and product name can be swapped with an unrelated company and the interface still feels equally appropriate, the design is too generic.

# Premium UI Heuristics

Prefer:

- fewer, stronger visual ideas
- clear hierarchy over decoration
- consistent spacing with deliberate exceptions
- product-native terminology
- realistic content
- calm surfaces
- intentional density
- precise alignment
- contextual controls
- restrained accent usage
- typography-led structure
- semantic color
- meaningful states
- strong information architecture
- differentiated primary/secondary actions
- purposeful empty space

Premium does **not** mean “more effects.” Premium usually means fewer arbitrary decisions.

# Implementation Guidance

When coding UI:

1. Start with semantic structure and information hierarchy.
2. Build the unstyled or minimally styled layout first.
3. Establish tokens for spacing, type, radius, borders, surfaces, and semantic colors.
4. Apply only the minimum visual treatments needed for hierarchy.
5. Add interaction states.
6. Test dense, sparse, long, empty, loading, and error content.
7. Review mobile and keyboard behavior.
8. Run the anti-slop audit below before completion.

Do not “premiumize” a weak layout by layering gradients, shadows, glass, or motion over it.

# Anti-Slop Audit

Before declaring a UI complete, answer every question.

## Identity

- Does the UI have a product-specific visual point of view?
- Are at least three design decisions specific to this product/domain?
- Would removing the logo still leave clues about what product this is?

## Layout

- Is everything unnecessarily inside a card?
- Are there repeated 3-column grids with no information reason?
- Is the page overly centered or symmetrical?
- Is section rhythm varied intentionally?
- Does density match the task?

## Color

- Was purple/indigo/cyan chosen intentionally rather than by default?
- Are gradients semantic or brand-driven?
- Is glow necessary?
- Is color doing meaningful work?

## Typography

- Is the type hierarchy deliberate?
- Are line lengths and density appropriate?
- Are numbers/data treated appropriately?
- Is low-contrast gray text hurting readability?

## Components

- Are radii purposeful rather than universal?
- Are pills limited to pill-like semantics?
- Are icons necessary and meaningful?
- Are buttons labeled with specific actions?
- Are primary and secondary actions unmistakable?

## Content

- Is the copy specific to the product?
- Are buzzwords removable without losing meaning?
- Is any trust signal fabricated?
- Is sample data realistic and domain-relevant?

## Motion

- Does every animation explain state, space, causality, or feedback?
- Would the product still feel premium with decorative motion removed?
- Is reduced motion respected?

## UX

- Are loading, empty, error, success, disabled, and permission states covered?
- Are keyboard and mobile interactions sound?
- Are touch targets and contrast accessible?
- Do charts and metrics support actual decisions?

If several answers expose generic defaults, revise before presenting the UI as finished.

# Fast Slop Smell Test

Treat these as cumulative signals, not automatic violations:

- Inter/Geist + default Tailwind neutrals
- violet primary
- gradient headline
- announcement pill
- centered hero
- two pill CTAs
- three identical feature cards
- Lucide icons in rounded squares
- glow behind screenshot
- avatar pile + stars
- fake “10K+ users”
- fade-up on scroll
- hover-scale cards
- generic “supercharge your workflow” copy

One or two may be fine. A pile of them means the interface likely needs stronger art direction.

# Final Rule

**Do not ask “How do I make this look more designed?” by adding visual effects. Ask “What decisions make this interface uniquely right for this product?”**

A premium UI should feel authored, not generated.
