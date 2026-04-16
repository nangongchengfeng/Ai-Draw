\# Doodle Sketch SaaS Landing Page Prompt (S12)



\## Objective

Design and specify a \*\*conversion-focused Full Landing Page\*\* for a \*\*SaaS product\*\* using the \*\*S12 Doodle Sketch\*\* style. Output must be \*\*engineering-ready\*\*: tokens, layout specs, components, responsive behavior, and accessibility.



\## Inputs

\- \*\*Style:\*\* S12 — Doodle Sketch

\- \*\*Industry:\*\* SaaS

\- \*\*Use:\*\* Full Landing Page



\## Assumptions

\- Product name placeholder: \*\*\[Automatic naming]\*\*

\- Core value prop placeholder: \*\*\[One-line Value Proposition]\*\*

\- Primary CTA: \*\*Start free trial\*\*

\- Secondary CTA: \*\*Book a demo\*\*

\- Target audience: \*\*B2B teams and developers\*\*

\- No real metrics, certifications, or customer logos are claimed; all proof uses placeholders

\- Target stack: \*\*React + Next.js (App Router) + TypeScript + Tailwind CSS\*\* using \*\*CSS variables\*\* for theming



\---



\## Style DNA (S12 – Doodle Sketch)



\### Style Seeds

\- \*\*Palette strategy:\*\* Clean, neutral base with playful accents. Hand-drawn feel.

\- \*\*Typography:\*\* Clean sans-serif mixed with sketch-style fonts (Indie Flower). Approachable.

\- \*\*Radius policy:\*\* Soft, irregular (12-20px). Natural feel.

\- \*\*Shadow policy:\*\* Subtle, soft diffused shadows.

\- \*\*Border language:\*\* Irregular, hand-drawn lines. Squiggly aesthetics.

\- \*\*Patterns/textures:\*\* Doodle-style patterns, squiggles, stars, and hand-drawn icons.

\- \*\*Motion:\*\* Playful, bouncing animations (300-500ms).



Tone: confident, precise, non-hype.



\---



```yaml

tokens:

&#x20; meta:

&#x20;   style\_id: "S12"

&#x20;   style\_name: "Doodle Sketch"

&#x20;   industry: "SaaS"

&#x20;   use\_case: "Full Landing Page"

&#x20; color:

&#x20;   bg:

&#x20;     primary: "#FFFFFF"

&#x20;     secondary: "#FFFBEB"

&#x20;   text:

&#x20;     primary: "#1A1A1A"

&#x20;     secondary: "#4A4A4A"

&#x20;     muted: "#9CA3AF"

&#x20;   brand:

&#x20;     primary: "#F59E0B"

&#x20;     accent: "#EC4899"

&#x20;   border:

&#x20;     strong: "#1A1A1A"

&#x20;     subtle: "rgba(0,0,0,0.1)"

&#x20;   focus:

&#x20;     ring: "#F59E0B"

&#x20; radius:

&#x20;   none: 0

&#x20;   sm: 8

&#x20;   md: 16

&#x20;   lg: 24

&#x20;   irregular: "255px 15px 225px 15px/15px 225px 15px 255px"

&#x20; border:

&#x20;   width: { hairline: 1, medium: 2, strong: 3 }

&#x20; shadow:

&#x20;   soft: "0 4px 14px 0 rgba(0,0,0,0.05)"

&#x20; layout:

&#x20;   container: { content: 1100, wide: 1200 }

&#x20; motion:

&#x20;   duration: { fast: 200, normal: 400 }

&#x20;   easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)"

&#x20; typography:

&#x20;   font:

&#x20;     sans: { primary: "Indie Flower", fallback: \["Quicksand", "sans-serif"] }

&#x20;   scale:

&#x20;     h1: { size: 56, line: 64, weight: 400, tracking: 0.02 }

&#x20;     h2: { size: 40, line: 48, weight: 400, tracking: 0.01 }

&#x20;     body: { size: 18, line: 28, weight: 400, tracking: 0 }

&#x20; spacing:

&#x20;   base: 10

&#x20;   section\_py: { mobile: \[80, 100], desktop: \[120, 160] }

```



\---



\## Deliverables

\- Full hero section with high-impact product visualization

\- Multi-column features grid with icon/illustration slots

\- Social proof/customer logo strip (using placeholders)

\- Pricing table with monthly/annual toggle

\- FAQ accordion system

\- Final conversion CTA module

\- Responsive footer with site map



\---



\## Accessibility \& Responsive

\- WCAG AA contrast

\- Visible focus rings

\- Reduced motion support

\- Touch targets ≥ 44px

\- Mobile-first layout



\---



\## Engineering Notes

\- CSS variables for all tokens

\- Tailwind config mapping tokens

\- Use semantic HTML5 elements

\- Implement responsive design with mobile-first approach

\- Ensure all interactive elements are keyboard accessible

\- Include loading states and error handling



\---



\## Acceptance Checklist

\- Clear hierarchy and visual discipline

\- Primary CTA visible above the fold

\- No fake metrics or certifications

\- Trust modules included

\- Fully responsive

\- Accessible by keyboard



\---



\## Do / Don't



\*\*Do\*\*

\- Use hand-drawn elements

\- Maintain playful tone

\- Use irregular borders

\- Add whimsical touches



\*\*Don't\*\*

\- Don't be too corporate

\- Don't use straight lines

\- Don't over-animate

\- Don't use cold colors

# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
