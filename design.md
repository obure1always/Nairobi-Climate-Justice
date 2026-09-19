# Climate Justice Learning PWA — DESIGN.md

## 1. Design direction

**Product:** Mobile-first Progressive Web Application for climate adaptation literacy and climate justice awareness among youth in Kibera and Ruaraka, Nairobi.

**Primary audience:** Youth learners, approximately 15–24 years old, using smartphones. The interface must also work well for facilitators/research staff and participants with limited connectivity.

**Design goal:** Make climate learning feel modern, credible, local, approachable, and interactive without becoming childish, political, activist-branded, or visually overwhelming.

**Visual personality:**
- Contemporary educational product
- Nairobi / East African visual cues used subtly
- Climate and nature inspired, but not stereotypically "green"
- Strong editorial hierarchy
- Warm, human, optimistic
- Evidence-led and trustworthy
- Mobile-first and touch-friendly
- Accessible by default
- Designed for intermittent connectivity

**Do not imitate:** government portals, NGO report websites, generic SaaS dashboards, crypto/AI aesthetics, political campaign sites, children's cartoon interfaces, or dense academic LMS interfaces.

**Core principle:** Content and comprehension are more important than decoration.

---

## 2. Product structure

The interface must support these research-defined learning modules:

1. Nairobi Climate Risk
2. Urban Flooding
3. Heat & Health
4. Water Stress & Disease Prevention
5. Climate Justice
6. Green Claims
7. Safe Civic Participation

The product should contain:
- Public landing experience
- About / project context
- Learning hub
- Module and lesson views
- Quizzes
- Baseline assessment
- Endline assessment
- Learner progress
- Resources / sources
- Participant access
- Appropriate research/facilitator administration surfaces

The product is educational. It must not introduce campaign functionality, political persuasion, petitions, partisan messaging, social networking, or candidate advocacy.

---

## 3. Brand character

### Keywords

`Local` · `Climate-aware` · `Evidence-led` · `Youthful` · `Calm` · `Accessible` · `Practical` · `Trustworthy`

### Emotional target

The learner should feel:
1. "This is about my environment."
2. "I understand what is happening."
3. "I can learn what to do safely."
4. "I can evaluate information for myself."

Avoid fear-heavy climate messaging. Serious topics may be presented clearly without disaster sensationalism.

---

## 4. Color system

Use semantic color roles rather than arbitrary colors.

### Core palette

| Token | Value | Role |
|---|---|---|
| `color.canvas` | `#F7F8F3` | Main page background |
| `color.surface` | `#FFFFFF` | Cards, sheets, primary surfaces |
| `color.surfaceMuted` | `#EEF2EA` | Secondary sections and muted cards |
| `color.ink` | `#17221B` | Primary text |
| `color.inkMuted` | `#536158` | Secondary text |
| `color.border` | `#D9E1D9` | Borders and dividers |
| `color.primary` | `#176B4D` | Primary actions and learning identity |
| `color.primaryDark` | `#0E4A36` | Hover, active, strong emphasis |
| `color.primarySoft` | `#DDEDE5` | Soft green backgrounds |
| `color.secondary` | `#2D7182` | Water / information / secondary actions |
| `color.secondarySoft` | `#DDEDF0` | Secondary information backgrounds |
| `color.sun` | `#E7A92B` | Warm accent, progress, highlights |
| `color.sunSoft` | `#FFF1CC` | Highlight backgrounds |
| `color.danger` | `#B5473A` | Errors and critical warnings |
| `color.dangerSoft` | `#F9E3DF` | Error backgrounds |
| `color.success` | `#24734F` | Success state |
| `color.successSoft` | `#E1F0E7` | Success backgrounds |

### Color rules

- Green is the primary action color, not a universal decoration.
- Blue/teal communicates water, information, and secondary content.
- Yellow/orange is an accent, not the dominant page color.
- Red is reserved for errors, warnings, or genuinely critical information.
- Never use color as the only method of communicating meaning.
- Maintain WCAG AA contrast for normal text.
- Prefer light surfaces for learning content.
- Dark sections may be used for hero moments or high-contrast transitions, but should not dominate the application.

---

## 5. Typography

### Preferred typeface

Use **Inter** for UI and body text.

Fallback:
`system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

### Type scale

| Token | Size | Weight | Line height | Use |
|---|---:|---:|---:|---|
| `type.display` | 48px | 700 | 1.05 | Large desktop hero |
| `type.h1` | 36px | 700 | 1.10 | Page titles |
| `type.h2` | 28px | 700 | 1.15 | Major sections |
| `type.h3` | 22px | 700 | 1.25 | Cards / module titles |
| `type.h4` | 18px | 650 | 1.30 | Subsections |
| `type.bodyLarge` | 18px | 400 | 1.60 | Learning content |
| `type.body` | 16px | 400 | 1.55 | Default body |
| `type.bodySmall` | 14px | 400 | 1.45 | Metadata |
| `type.label` | 13px | 600 | 1.30 | Labels / chips |
| `type.caption` | 12px | 500 | 1.35 | Fine metadata |

### Typography rules

- Learning text should prioritize readability over density.
- Use 16–18px body text on mobile.
- Keep educational paragraphs around 60–75 characters per line on larger screens.
- Avoid all-caps except for tiny labels.
- Use sentence case for buttons and headings.
- Never use decorative display fonts for core learning content.

---

## 6. Spacing

Use an 8px base rhythm.

```text
space.1 = 4px
space.2 = 8px
space.3 = 12px
space.4 = 16px
space.5 = 20px
space.6 = 24px
space.8 = 32px
space.10 = 40px
space.12 = 48px
space.16 = 64px
space.20 = 80px
space.24 = 96px
```

### Layout rules

- Mobile page padding: 16px
- Tablet page padding: 24px
- Desktop page padding: 32px
- Maximum content width: 1200px
- Learning-reading width: approximately 720px
- Major section spacing: 64–96px desktop, 40–64px mobile
- Do not fill every available pixel with content.

---

## 7. Responsive breakpoints

Use mobile-first CSS.

```text
mobile: 0–639px
tablet: 640–1023px
desktop: 1024px+
wide: 1280px+
```

The mobile experience is the primary experience, not a compressed desktop layout.

At mobile widths:
- Single-column learning flow
- Bottom navigation may be used for core participant actions
- Cards stack vertically
- Touch targets are at least 44×44px
- Tables should become cards or horizontally scroll where necessary
- Avoid hover-dependent interactions

---

## 8. Border radius

```text
radius.sm = 8px
radius.md = 12px
radius.lg = 16px
radius.xl = 24px
radius.pill = 999px
```

Use:
- 12px for normal cards and controls
- 16px for prominent learning cards
- 24px for hero containers and large feature surfaces
- Pill radius for tags, status chips, and compact progress indicators

Avoid excessive rounded containers. Not every element needs a card.

---

## 9. Elevation

Use restrained elevation.

```text
shadow.none = none
shadow.sm = 0 1px 3px rgba(23, 34, 27, 0.06)
shadow.md = 0 8px 24px rgba(23, 34, 27, 0.08)
shadow.lg = 0 16px 40px rgba(23, 34, 27, 0.12)
```

Rules:
- Prefer borders and surface contrast over heavy shadows.
- Learning cards can use `shadow.sm`.
- Modals and floating panels may use `shadow.md`.
- Avoid glossy or glassmorphism-heavy UI.

---

## 10. Navigation

### Public navigation

Desktop:
- Logo / product name
- Learn
- About
- Resources
- Language switcher
- Participant access / Start learning

Mobile:
- Compact header
- Menu or bottom navigation where appropriate
- Keep the primary learning action obvious

### Participant navigation

Prioritize:
- Home / Progress
- Learn
- Assessments
- Resources
- Settings

Navigation must not compete with the lesson content.

---

## 11. Hero design

The landing-page hero should communicate the product in under five seconds.

Recommended structure:
- Small eyebrow: `CLIMATE LEARNING • NAIROBI`
- Strong headline about understanding climate change and local action
- One-sentence explanation
- Primary CTA: `Start learning`
- Secondary CTA: `Explore the modules`
- Local environmental visual or illustration
- Small trust/context line explaining that the experience is designed for youth in Nairobi

Do not use:
- Generic stock photos of polar bears
- Apocalyptic imagery
- Political protest imagery
- Excessive gradients
- Giant decorative illustrations that push content below the fold

---

## 12. Module cards

Each module card should contain:
- Module number
- Short title
- One-sentence description
- Simple icon/illustration
- Progress indicator where relevant
- Estimated learning time if known
- Clear action

Example hierarchy:

```text
01
Nairobi Climate Risk
Understand the climate risks affecting Nairobi
[Progress bar]
Continue →
```

Module cards should feel like a coherent curriculum rather than seven unrelated marketing tiles.

---

## 13. Lesson page

Recommended hierarchy:

```text
Breadcrumb
Module label
Lesson title
Short introduction
Hero illustration / diagram
Learning content
Key idea card
Local example
Evidence / source
Quick check
Previous / Next lesson
Progress
```

### Lesson content rules

- Break long explanations into short sections.
- Use headings, bullets, diagrams, and callout cards.
- Highlight one main idea at a time.
- Explain technical concepts in plain language before introducing terminology.
- Use local examples relevant to Nairobi where the research content supports them.
- Every factual climate claim should have an appropriate source/reference in the content model.

---

## 14. Quiz design

Quiz UI should be simple and distraction-free.

Preferred pattern:
- Question number / total
- Progress bar
- Question
- 2–4 answer options
- Submit / Next
- Immediate or configured feedback
- Short explanation of the correct answer

Answer options:
- Large touch target
- Clear selected state
- Do not rely on color alone
- Maintain the question when showing feedback

Do not add game mechanics that distort the research assessment.

---

## 15. Assessment design

The proposal defines:
- Baseline knowledge assessment
- Endline assessment
- Advocacy/self-efficacy measures
- Usability evaluation using SUS

Assessment screens should look more serious and focused than ordinary quizzes.

Rules:
- One question at a time where practical on mobile.
- Clear completion status.
- Explain consent and research context where appropriate.
- Never make assessment answers feel like a public social interaction.
- Preserve participant privacy.

---

## 16. Progress dashboard

Show:
- Overall learning progress
- Module completion
- Assessment status
- Recent activity
- Offline/sync status
- Continue learning CTA

Avoid:
- Competitive leaderboards
- Public rankings
- Social feeds
- Popularity counters

The progress dashboard is about personal learning progress, not competition.

---

## 17. Offline experience

Offline status is a first-class UI state.

### States

`Online`
- Normal UI
- Small status indicator where useful

`Offline`
- Non-blocking offline indicator
- Cached learning content remains usable
- Explain that progress will sync when connectivity returns

`Syncing`
- Clear but subtle syncing state

`Synced`
- Brief confirmation

`Sync failed`
- Explain what happened
- Keep the learner's local progress
- Provide retry behavior
- Never silently discard locally stored progress

Do not make offline mode look like an error.

---

## 18. Language support

Support:
- English
- Kiswahili

Use localization keys rather than duplicated UI components.

Example:

```ts
{
  "home.startLearning": "Start learning",
  "home.exploreModules": "Explore modules",
  "lesson.next": "Next lesson",
  "lesson.previous": "Previous lesson",
  "offline.message": "You're offline. Your progress will sync when you're connected again."
}
```

Language switching should be visible, predictable, and persistent.

Do not machine-translate research terminology blindly. Content translations should be reviewed.

---

## 19. Components

Create reusable components before creating one-off page styles.

### Core components

- `Button`
- `IconButton`
- `Link`
- `Header`
- `Footer`
- `MobileNavigation`
- `LanguageSwitcher`
- `ModuleCard`
- `LessonCard`
- `LessonContent`
- `ProgressBar`
- `ProgressRing`
- `StatusBadge`
- `Callout`
- `SourceCitation`
- `QuizOption`
- `QuizQuestion`
- `AssessmentQuestion`
- `FormField`
- `Modal`
- `Toast`
- `OfflineBanner`
- `SyncStatus`
- `EmptyState`
- `ErrorState`
- `LoadingState`
- `Skeleton`
- `Accordion`
- `Tabs`

Components must support accessible states and keyboard interaction.

---

## 20. Button rules

Primary:
- Filled `color.primary`
- White text
- Used for the most important action

Secondary:
- White/light surface
- Green border/text
- Used for secondary actions

Tertiary:
- Text-only
- Used for low-priority navigation

Danger:
- Reserved for destructive or genuinely critical actions

Minimum mobile touch target: 44×44px.

Avoid having multiple visually equal primary CTAs in the same viewport.

---

## 21. Forms

Forms should:
- Use visible labels
- Show required/optional status
- Provide inline validation
- Preserve entered values after validation errors
- Use appropriate input types
- Support keyboard and screen-reader navigation
- Avoid placeholder-only labels

Error messages should explain how to fix the problem.

---

## 22. Icons and imagery

Use a consistent line-icon family such as Lucide.

Rules:
- Icons supplement text; they do not replace important labels.
- Use simple climate/environmental visual metaphors.
- Prefer custom illustrations or clean diagrams over generic stock photography.
- Use meaningful alt text.
- Decorative images should use empty alt text.
- Avoid visual stereotypes of African communities.

Suggested illustration language:
- Flat/editorial
- Slightly organic geometry
- Natural textures used sparingly
- Strong silhouettes
- Limited palette from the design tokens

---

## 23. Data visualization

For climate or assessment data:
- Keep charts simple.
- Use direct labels where possible.
- Provide text equivalents for important findings.
- Do not rely on red/green alone.
- Use the palette consistently.
- Avoid decorative 3D charts.

---

## 24. Accessibility

Target **WCAG 2.2 AA**.

Required:
- Semantic HTML
- Keyboard navigation
- Visible focus indicators
- Accessible form labels
- Minimum 44×44px touch targets
- Sufficient color contrast
- Alt text
- Captions/transcripts where media is used
- Reduced-motion support
- Screen-reader-friendly status messages
- Logical heading hierarchy
- No keyboard traps
- No interaction that depends only on color
- Responsive text resizing

Test with:
- Lighthouse
- axe
- Keyboard-only navigation
- Chrome accessibility tools
- Android/mobile testing

---

## 25. Motion

Motion should clarify state or hierarchy.

Use:
- Short transitions
- Progress animation
- Subtle page transitions
- Loading skeletons

Avoid:
- Parallax-heavy effects
- Constant animated backgrounds
- Long entrance animations
- Motion that blocks learning
- Animation that creates accessibility issues

Respect `prefers-reduced-motion`.

---

## 26. Content tone

Voice:
- Clear
- Respectful
- Evidence-led
- Youth-friendly without slang overload
- Locally relevant
- Non-partisan
- Non-judgmental

Prefer:
> "Here is how flooding can happen in dense urban areas."

Avoid:
> "Your community is suffering because nobody is doing anything."

Prefer:
> "Check the source before accepting a climate claim."

Avoid:
> "Don't believe what politicians tell you."

The product teaches learners how to evaluate information and participate safely; it does not tell them what political position to adopt.

---

## 27. Safe Civic Participation module

This module must remain educational and neutral.

Design for topics such as:
- Understanding public institutions
- Finding credible public information
- Understanding consultations and public participation
- Evaluating claims
- Lawful and safe civic participation
- Communicating respectfully

Do not create:
- Candidate comparison tools
- Political persuasion
- Party promotion
- Campaign functionality
- Petition tools
- Political fundraising
- Political targeting
- Candidate rankings

---

## 28. Research/privacy surfaces

Participant-facing research UI should be calm and explicit.

Use:
- Plain-language consent explanations
- Clear privacy information
- Minimal personal-data collection
- Participant IDs rather than displaying identifying information
- Clear assessment instructions
- Neutral research language

Do not expose:
- Participant lists
- Personal contact details
- Precise location
- Internal research identifiers in normal learner UI

---

## 29. Responsive content priority

### Mobile

Priority order:
1. Current learning task
2. Progress
3. Navigation
4. Supporting information
5. Decorative content

### Desktop

Use additional space for:
- Better reading width
- Supporting illustrations
- Side navigation where helpful
- Assessment context
- Resource/source panels

Never use desktop space simply to make cards larger.

---

## 30. States every major component must support

Every interactive component should account for:

- Default
- Hover
- Focus
- Active
- Disabled
- Loading
- Success
- Error
- Empty
- Offline where relevant

---

## 31. Technical design constraints

The visual system must be implementable with:

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Service Worker / PWA APIs
- IndexedDB
- Dexie.js or equivalent
- Node.js
- Express
- PostgreSQL
- Sequelize or equivalent ORM

Design tokens should be represented as CSS variables and/or Tailwind theme tokens rather than scattered hard-coded values.

---

## 32. Do-not-drift rules

Agents implementing this project must NOT:

- Introduce a random new color palette.
- Introduce a second unrelated typography system.
- Add gradients everywhere.
- Turn every section into a floating card.
- Use excessive glassmorphism.
- Use huge rounded pills for ordinary buttons.
- Create dense dashboard layouts for learner pages.
- Add gamification that changes assessment behavior.
- Add social networking.
- Add political persuasion features.
- Add AI recommendations unless explicitly approved as a product requirement.
- Replace local/offline-first behavior with connectivity-dependent UX.
- Remove bilingual support.
- Hide source attribution for climate claims.

---

## 33. Design QA checklist

Before considering a screen complete, verify:

### Visual
- [ ] Correct palette roles
- [ ] Correct typography hierarchy
- [ ] 8px spacing rhythm
- [ ] Consistent radii
- [ ] Restrained elevation
- [ ] No unnecessary decorative elements

### UX
- [ ] Clear primary action
- [ ] Logical information hierarchy
- [ ] Mobile-first layout
- [ ] Touch-friendly controls
- [ ] Clear loading/error/empty states
- [ ] Offline state considered

### Accessibility
- [ ] WCAG 2.2 AA target
- [ ] Keyboard navigation
- [ ] Visible focus
- [ ] Contrast checked
- [ ] Semantic headings
- [ ] Accessible labels
- [ ] No color-only communication

### Content
- [ ] Uses approved curriculum terminology
- [ ] Climate claims have sources
- [ ] English/Kiswahili structure preserved
- [ ] Civic content remains neutral
- [ ] No unsupported claims added

### Engineering
- [ ] Reusable component used where appropriate
- [ ] Design token used instead of arbitrary value
- [ ] Responsive behavior verified
- [ ] No duplicated styling without reason
- [ ] PWA/offline behavior preserved

---

## 34. Agent instruction

Before changing or creating UI:

1. Read this `DESIGN.md`.
2. Inspect existing components and routes.
3. Reuse existing design tokens and components.
4. Implement mobile-first.
5. Check accessibility.
6. Check offline behavior where the feature touches learner progress/content.
7. Compare the finished screen against this file.
8. Do not introduce new visual tokens unless the existing system genuinely cannot represent the requirement.
9. If a new token is necessary, update this file and explain the reason in the implementation notes.

This file is the visual source of truth for the project.
