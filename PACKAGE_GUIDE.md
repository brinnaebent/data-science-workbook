# @brinnaebent/workbook

Infrastructure package for building interactive textbook workbooks with Next.js. Install it in a textbook repo and get routing, rendering, navigation, annotations, checkpoints, and a design system — author only content and custom interactives.

---

## How it works

This package provides the full UI shell for an interactive textbook:

- **Routing** — Next.js App Router pages for unit → chapter → section navigation
- **Content renderer** — dispatches typed content blocks to the right component
- **Navigation** — collapsible sidebar, prev/next section links, breadcrumbs
- **Annotations** — text highlighting with notes, persisted in localStorage
- **Checkpoints** — multiple-choice and reflective questions, persisted in localStorage
- **Design system** — Tailwind v4 CSS tokens matching the DESIGN.md spec
- **Download Context** — API route that serializes any unit to markdown for AI Q&A

Content lives as typed TypeScript objects. No MDX. No CMS. No markdown at runtime.

The hierarchy is: **Unit → Chapter → Section → ContentBlock[]**

---

## Creating a new textbook

### 1. Set up the repo

Create a new directory and scaffold it with the CLI:

```bash
mkdir my-textbook && cd my-textbook
npx @brinnaebent/workbook init
```

This copies the App Router page templates into `app/`, scaffolds a starter `content/` tree, and writes stubs for `workbook.config.ts`, `next.config.ts`, `tsconfig.json`, `package.json`, and `postcss.config.mjs`.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure your textbook

Edit `workbook.config.ts`:

```ts
import { defineConfig } from "@brinnaebent/workbook";

export default defineConfig({
  title: "My Textbook",
  description: "A short description shown on the home page.",
  components: {
    // Register interactive components here (see Step 5)
  },
});
```

### 4. Author content

Content lives in `content/` with one file per chapter:

```
content/
  index.ts                                  ← exports units[] + helper functions
  foundations/
    index.ts                                ← assembles Unit from chapters
    chapters/
      introduction/
        page_content.tsx                    ← exports a Chapter
      core-concepts/
        page_content.tsx
```

Each `page_content.tsx` exports a typed `Chapter`:

```ts
// content/foundations/chapters/introduction/page_content.tsx
import type { Chapter } from "@brinnaebent/workbook";

const introduction: Chapter = {
  id: "introduction",
  number: 1,
  title: "Introduction",
  overview: "A gentle start.",
  sections: [
    {
      id: "overview",
      number: 1,
      title: "Overview",
      blocks: [
        { type: "text", html: "<p>Hello world.</p>" },
        {
          type: "callout",
          variant: "tip",
          title: "Pro tip",
          html: "Start with an analogy.",
        },
        {
          type: "checkpoint",
          id: "foundations-intro-q1",          // must be globally unique
          kind: "mc",
          question: "What is this?",
          options: [
            { label: "A textbook", correct: true, explanation: "Yes." },
            { label: "A dashboard", correct: false, explanation: "No." },
          ],
        },
      ],
    },
  ],
};

export default introduction;
```

The unit index assembles chapters into a `Unit`:

```ts
// content/foundations/index.ts
import type { Unit } from "@brinnaebent/workbook";
import introduction from "./chapters/introduction/page_content";
import coreConcepts from "./chapters/core-concepts/page_content";

const foundations: Unit = {
  id: "foundations",
  number: 1,
  title: "Foundations",
  description: "Core concepts.",
  chapters: [introduction, coreConcepts],
};

export default foundations;
```

`content/index.ts` imports units and re-exports the helper functions (`getUnit`, `getChapter`, `getSection`, `getAdjacentSections`) — the CLI scaffolds this file and you rarely need to touch it beyond adding new unit imports.

### 5. Add interactive components

Drop React components into `interactives/` and register them in `workbook.config.ts`:

```ts
import { defineConfig } from "@brinnaebent/workbook";
import VizName from "./interactives/VizName";

export default defineConfig({
  title: "My Textbook",
  description: "...",
  components: {
    VizName,
  },
});
```

Reference them in content by string name:

```ts
{
  type: "interactive",
  component: "MyDemo",
  caption: "Drag the slider to see the effect.",
  props: { initialValue: 0.5 },
}
```

If a component name isn't registered, a labeled placeholder renders instead — useful for authoring content before the interactive is built.

### 6. Run the dev server

```bash
npm run dev
```

> **Note on search:** Full-text search (powered by Pagefind) only works after a production build. In development, the search UI will appear but return no results. To test search, run a production build and serve it locally:
>
> ```bash
> npm run build
> npx serve out
> ```

---

## Block types

Every piece of content is a typed object in a section's `blocks` array.

### `text`
Prose content as an HTML string. Supports inline KaTeX math with `$...$` and `$$...$$`.

```ts
{ type: "text", html: "<p>The loss is $L = -\log p(y|x)$.</p>" }
```

### `callout`
Four variants: `info` (blue), `tip` (emerald), `warning` (amber), `example` (violet).

```ts
{ type: "callout", variant: "warning", title: "Common mistake", html: "Don't skip this step." }
```

### `checkpoint`
Multiple-choice or reflective question. Answers persist in localStorage keyed by `id`. The `id` must be **globally unique** across all units — use a namespaced pattern like `{unit}-{chapter}-{concept}`.

```ts
{
  type: "checkpoint",
  id: "ml-backprop-chain-rule",
  kind: "mc",
  question: "What does the chain rule let us compute?",
  options: [
    { label: "Gradients through composed functions", correct: true, explanation: "Yes — that's the whole point." },
    { label: "The learning rate", correct: false, explanation: "The learning rate is a hyperparameter, not derived via chain rule." },
  ],
}
```

For open-ended questions, use `kind: "reflective"` with an optional `sampleAnswer`.

### `reflection`
Like a checkpoint but amber-styled with a "show sample answer" toggle instead of correct/incorrect feedback.

```ts
{
  type: "reflection",
  id: "ml-backprop-intuition",
  question: "In your own words, why does backprop work backwards?",
  sampleAnswer: "Because each layer's gradient depends on the layers after it...",
}
```

### `interactive`
Mounts a registered React component. Pass arbitrary `props` through.

```ts
{ type: "interactive", component: "GradientDescent", caption: "Adjust the learning rate.", props: { lr: 0.1 } }
```

### `image`
Static image, always centered, with optional caption. Control the rendered width with the `width` prop (any CSS value). Omit `width` to fill the content column.

```ts
{ type: "image", src: "/images/diagram.png", alt: "Architecture diagram", caption: "The encoder-decoder architecture." }
// or with a fixed width:
{ type: "image", src: "/images/diagram.png", alt: "Architecture diagram", caption: "A narrow detail.", width: "400px" }
```

### `video`
YouTube or Vimeo URL embed.

```ts
{ type: "video", src: "https://www.youtube.com/watch?v=...", caption: "Lecture recording." }
```

### `timeline`
Horizontally scrollable sequence of dated events.

```ts
{
  type: "timeline",
  events: [
    { year: "1956", title: "Dartmouth Workshop", body: "The field of AI is formally founded." },
    { year: "1986", title: "Backpropagation", body: "Rumelhart, Hinton, and Williams popularize gradient-based training." },
  ],
}
```

### Domain-specific types

When a pattern repeats 3+ times, create a dedicated block type. Extend `ContentBlock` in your repo:

```ts
// content/types.ts
import type { ContentBlock } from "@brinnaebent/workbook";

type ComparisonBlock = {
  type: "comparison";
  left: { label: string; html: string };
  right: { label: string; html: string };
};

export type MyContentBlock = ContentBlock | ComparisonBlock;
```

Add the case to `app/api/context/[unit]/route.ts` to keep it out of the Download Context output.

---

## Design system

Import the shared CSS in your `app/globals.css`:

```css
@import "@brinnaebent/workbook/workbook.css";

@source "../../app/**/*.tsx";
@source "../../interactives/**/*.tsx";
```

This sets Tailwind v4 `@theme` tokens for the full color system from DESIGN.md:

| Token | Usage |
|---|---|
| `blue-600` | Primary action — buttons, links, active sidebar |
| `emerald` family | Correct feedback |
| `red` family | Incorrect feedback |
| `amber` family | Warning callouts, reflection blocks |
| `violet` family | Example callouts |
| `slate` family | All neutrals — backgrounds, borders, text |

Never use emerald or red outside of correct/incorrect feedback contexts.

---

## Download Context

The sidebar includes a "Download Context" button that calls `/api/context/[unitId]` and downloads the full unit as a clean markdown file. This is designed for pasting into an AI assistant for Q&A.

The route is scaffolded into `app/api/context/[unit]/route.ts` by the CLI. It serializes all standard block types. For domain-specific block types, add cases to the `blockToMarkdown` switch in that file.

---

## Updating the package in your textbook repo

When a new version of `@brinnaebent/workbook` is published, run:

```bash
npm install @brinnaebent/workbook@latest
```

That's it. Page layout changes, new block renderers, navigation improvements, and design updates all take effect immediately — your `app/` stubs delegate to the package, so they pick up everything automatically.

### Migrating to 0.2.0

0.2.0 ships client components in a separate entry point (`@brinnaebent/workbook/client`) so that `"use client"` directives are preserved in the built bundle. This requires two one-time changes in your textbook repo:

**1. Remove `transpilePackages` from `next.config.ts`**

```ts
// before
const nextConfig: NextConfig = {
  output: "export",
  transpilePackages: ["@brinnaebent/workbook"],
};

// after
const nextConfig: NextConfig = {
  output: "export",
};
```

`transpilePackages` caused Next.js to re-bundle the package and produce a duplicate React instance, breaking hooks during static export. The package is now a prebuilt CJS/ESM bundle and doesn't need transpilation. Tailwind class scanning continues to work via the `@source` directive in `workbook.css`.

**2. Update any direct client component imports**

If you import client components directly in your own files (not the scaffolded page stubs), update the import path:

```ts
// before
import { CheckpointBlock, Sidebar } from "@brinnaebent/workbook";

// after
import { CheckpointBlock, Sidebar } from "@brinnaebent/workbook/client";
```

The scaffolded page stubs (`app/[unitId]/...`) import only from the root entry and don't need changes.

### What you own vs. what auto-updates

| File | Owned by | Updates how |
|---|---|---|
| `app/layout.tsx` | You | Edit freely — root HTML, fonts, metadata |
| `app/page.tsx` | You | Edit freely — home page content |
| `app/globals.css` | You | Edit freely — Tailwind source paths |
| `app/[unitId]/layout.tsx` | Package | `npm install` |
| `app/[unitId]/page.tsx` | Package | `npm install` |
| `app/[unitId]/[chapterId]/page.tsx` | Package | `npm install` |
| `app/[unitId]/[chapterId]/[sectionId]/page.tsx` | Package | `npm install` |
| `app/api/context/[unit]/route.ts` | You | Edit for domain-specific block types |
| `content/` | You | Your content, never touched by updates |

### New block types

New block types are additive — existing content keeps working. To use one:

1. Add blocks of the new type to your `page_content.tsx` files. TypeScript will surface any required fields.
2. If you have a custom `content/types.ts` that extends `ContentBlock`, add the new type to your union.
3. Add a case to `app/api/context/[unit]/route.ts` if you want the new type serialized in the Download Context output.

---

## Package development

This repo is both the package source and a live preview environment. The `app/` directory runs a workbook using the `src/` components directly, with stub content in `content/`.

```bash
npm run dev        # preview on localhost:3003 (or next available port)
```

Edit anything in `src/components/` and the preview hot-reloads. When changes are ready to ship to consumer textbook repos, bump the version in `package.json` and publish:

```bash
npm publish
```

Consumer repos update with:

```bash
npm install @brinnaebent/workbook@latest
```

### Entry points

The package ships two entry points to keep `"use client"` out of server-rendered code:

| Import | What's in it |
|---|---|
| `@brinnaebent/workbook` | Types, page factories, `defineConfig`, server-safe components (`ContentRenderer`, `PrevNext`, `ImageBlock`), utilities |
| `@brinnaebent/workbook/client` | Client components: `CheckpointBlock`, `InteractiveBlock`, `AnnotationLayer`, `Sidebar`, `ReflectionBlock`, `TimelineBlock`, `VideoBlock` |

The page factory stubs scaffolded by the CLI (`app/[unitId]/page.tsx`, etc.) import only from the root entry — you don't need to change those. Only import from `/client` if you're using a client component directly in your own files.

### Package structure

```
src/
  types.ts                  — all content types (Unit, Chapter, Section, ContentBlock variants)
  renderMath.ts             — KaTeX utility ($...$ and $$...$$)
  unitToMarkdown.ts         — serializes a Unit to markdown (used by Download Context route)
  workbook.css              — Tailwind v4 design tokens
  index.ts                  — root entry: types, page factories, server-safe components
  client.ts                 — client entry ("use client"): CheckpointBlock, InteractiveBlock, AnnotationLayer, Sidebar, ReflectionBlock, TimelineBlock, VideoBlock
  components/
    ContentRenderer.tsx     — block dispatcher
    CheckpointBlock.tsx
    ReflectionBlock.tsx
    InteractiveBlock.tsx    — accepts componentMap prop from workbook.config.ts
    ImageBlock.tsx          — centered image with configurable width and caption
    AnnotationLayer.tsx     — text highlighting with localStorage persistence
    Sidebar.tsx
    SidebarShell.tsx        — collapsible sidebar wrapper (open/close state)
    PagefindSearch.tsx      — full-text search UI (powered by Pagefind)
    PrevNext.tsx
    TimelineBlock.tsx
    VideoBlock.tsx
  page-templates/
    unit-layout.tsx         — createUnitLayout(getUnit) factory
    unit-page.tsx           — createUnitPage(getUnit) factory
    chapter-page.tsx        — createChapterPage(getUnit, getChapter) factory
    section-page.tsx        — createSectionPage({ getUnit, getChapter, getSection, getAdjacentSections, componentMap }) factory
  templates/
    app/                    — consumer-owned files copied once by CLI (layout, page, globals.css)
    api/context/[unit]/     — Download Context route template
cli/
  init.js                   — npx @brinnaebent/workbook init scaffold command
```
