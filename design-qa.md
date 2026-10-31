# Design QA: Empty State 1

## Comparison setup

- Source truth: `artifacts/design-qa/empty-state-source.png`, captured from `https://reui.io/preview/base/empty-state-1` with REA evidence `ev_773879e08430565b9dd80adb374c5d8929ac46637ed53f00dd5000375bba565c`.
- Implementation: `artifacts/design-qa/empty-state-implementation.png`, captured from `http://localhost:3000/` in Chromium with REA evidence `ev_1618f733d5ef8cc235d1b85c39caf8dc6d754cfb1ce910856bff39d3687c8c87`.
- Viewport: 1920 × 975 CSS pixels. Both PNGs are 1920 × 975 pixels at device scale factor 1. No density or crop normalization was needed.
- State: dark theme, empty records, no hover or focus state.
- Full comparison: `artifacts/design-qa/empty-state-comparison.png`.
- Focused comparison: `artifacts/design-qa/empty-state-focused-comparison.png`, aligned crop `(680, 215, 1240, 710)` from each screenshot.
- REA pixel comparison: evidence `ev_98096e142b8cb154af650c955b3a17a14b232daf81bc3fc09d907eee24e91ecf`, 17,970 of 1,872,000 pixels changed at channel threshold 8 (0.96%). This metric does not distinguish text antialiasing from layout changes.

## Findings

- [P2] The headline uses a different font family.
  - Location: `EmptyState1` title.
  - Evidence: ReUI uses Inter at 24px, weight 600, 32px line height, and -0.6px letter spacing. The project token resolves to Figtree with the same size, weight, line height, and letter spacing. The source title is 301.64px wide; the implementation is 281.48px wide, a 20.16px difference.
  - Impact: The headline has a visibly narrower shape than the reference.
  - Fix: Change the existing global `font-sans` source to Inter if a project-wide font change is intended. The block keeps the current global token and adds no local font override.

## Fidelity surfaces

- Fonts and typography: Font family is the remaining P2 difference. The title size, weight, line height, letter spacing, copy, and wrapping match.
- Spacing and layout: Main empty-state bounds match at `(576, 228.625)` with size `768 × 257.5px`. The title and description share the source positions. Both action rows are at `y=454.125px`. Guide rows match at `(688, 646.125)` and `(966, 646.125)`, each `266 × 41.25px`.
- Colors and tokens: The implementation uses existing semantic tokens. Sampled source/implementation RGB values were background `(18, 18, 18)` / `(18, 18, 18)`, primary action `(226, 226, 226)` / `(227, 227, 227)`, secondary action `(28, 28, 28)` / `(29, 29, 29)`, guide border `(26, 27, 27)` / `(26, 27, 27)`, and illustration front `(31, 31, 31)` / `(32, 32, 32)`.
- Image and icon fidelity: The layered record illustration is composed from local shadcn Card and Skeleton primitives. The action, guide, and chevron icons use the configured Lucide icon exports at 16px. No external image or CSS asset was added.
- Copy and content: All visible labels and descriptions match the source.

## Comparison history

1. The first visual pass showed missing action and guide icons, guide rows at 46px instead of 41.25px, and darker canvas and action colors. The user requested icons. The block then added configured Lucide icons, sized them to 16px, tuned token-based colors, and hid the Next development indicator so it would not appear in the comparison. The final Chrome/REA capture and focused comparison show those fixes.
2. The source/implementation typography difference remains. The project uses its existing Figtree `font-sans` token, so no component-local font or stylesheet override was added. The user would need to choose a project-wide Inter token change to remove this mismatch.

## Evidence limits

- REA captured the accessible tree and checked browser console events. The tree exposes both action buttons, the Quick guides navigation, and both guide links. No page errors were reported; console entries were React DevTools information and the Next HMR connection.
- The sample links and buttons were not activated. This review compares the rendered empty state and does not validate integration behavior, keyboard interaction, or complete accessibility conformance.

## Follow-up polish

- [P3] Sampled color differences are at most one RGB level. Button widths differ from the source by less than 0.4px after layout tuning.

## Implementation checklist

- [x] Extract the block into `registry/blocks/` and register its shadcn dependencies.
- [x] Rebuild the reference structure with local shadcn primitives and configured icons.
- [x] Keep styles in static TSX utility classes and existing design tokens.
- [ ] Decide whether to switch the global `font-sans` token to Inter to clear the remaining P2.

final result: blocked
