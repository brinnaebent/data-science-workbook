# Pedagogical Style Guide

## Core Mission

Every page exists to do two things: build genuine conceptual understanding, and build judgment for applying that concept in the real world. These are not separate goals — they are achieved together by grounding every explanation in analogy before formalism, and by always following formalism with "so what."

---

## 1. Content Structure: Situation → Intuition → Formalism → So What

Every section should follow this arc, in order:

1. **Situation** — place the concept in a familiar context before introducing anything new. An analogy, a story, a question the student already cares about.
2. **Intuition** — explain the "why" behind what you're about to formalize. What problem is this solving? Why would someone have invented this?
3. **Formalism** — introduce the math, mechanism, or technical definition. Only after the intuition is established.
4. **So What** — connect back to practice. Why does a working engineer care about this? What would go wrong without it?

Sections that skip directly to formalism feel cold and don't stick. Sections that stay in analogy forever feel imprecise. The arc earns trust by doing both.

Be thoughtful about the use of different components. Don't use too many of one component (e.g., callout components) on a single page. Each page should be a balanced combination of different components.

When first creating the content, leave placeholders for images and interactive components. These can be filled in later.

---

## 2. The WHY Is Non-Negotiable

At every moment of formalism, ask: *Why does this piece of the equation exist? Why this operation and not another?*

- Why the dot product for attention? Why softmax instead of a simple average? Why the bias term?
- Anticipate student questions. If a thoughtful student would ask "wait, why not just..." — answer it before they ask.
- "Because it works" is never sufficient. "Because it preserves X, which we need for Y" is the standard.

---

## 3. Every Moment of Friction Is an Opportunity — But Only Use It Purposefully

Reserve active learning components for concepts that are:
- **Tricky** — hard to hold in your head as abstract text
- **Counterintuitive** — where students reliably get the wrong answer
- **Commonly misunderstood** — where confident-but-wrong is a documented failure mode

Do **not** add a checkpoint or interactive for concepts that are clear from prose alone. The signal value of a well-placed checkpoint depends on not overusing them.

The test for an **interactive**: *What would the reader have to take on faith without this?* If the answer is "nothing — they'd follow it from the text," skip the interactive.

The test for a **checkpoint question**: *Is there a specific misconception this question will surface and correct?* If the wrong answers aren't meaningfully tempting, the question isn't doing pedagogical work.

The test for a **reflection prompt**: *Is there something worth pausing on that can't be resolved with a single correct answer?* Good reflective questions ask students to connect, apply, or predict — not just recall.

---

## 4. Block Composition — Avoid Repetition and Walls

Each page is a composition of block types. A healthy page looks varied:

- **Text blocks** carry the main exposition
- **Callouts** interrupt the flow on purpose — when the reader needs a moment to consolidate
- **Checkpoints** mark transitions or test tricky moments
- **Interactives** appear when text cannot do the job alone

Patterns to avoid:
- Four text blocks in a row without a callout, checkpoint, or visual break
- Multiple checkpoints back to back without prose in between
- An interactive that appears without explanatory context immediately before and after it

A good heuristic: if you're writing the same block type more than twice consecutively, examine whether the content should be restructured.

---

## 5. Callout Semantics — Four Variants, Four Purposes

Callouts are not an overflow bin. Each variant has a specific job:

| Variant | Color | Purpose |
|---|---|---|
| `info` | Blue | Precise definitions the reader needs to hold. Use when a term must be locked in before the section can proceed. |
| `warning` | Amber | Common mistakes and misconceptions. Use when students reliably get something wrong. Name the wrong belief explicitly. |
| `tip` | Emerald | Connections to adjacent knowledge. "This is just X in disguise." Rewards students who are making broader connections. |
| `example` | Violet | Real-world application. Grounds the abstract in practice. |

A callout should interrupt the prose *intentionally* — it should earn its visual weight by doing something the prose cannot.

---

## 6. Checkpoint Design Standards

**Multiple-choice questions:**
- Wrong answers must be plausibly tempting — real misconceptions, not obviously wrong options
- Every incorrect answer needs a specific explanation, not "review the section"
- The question should be answerable from understanding, not memorization
- Prefer questions that distinguish between two closely related concepts (the most common confusion point)
- Explain why wrong answers are wrong

**Reflective questions:**
- Should ask students to connect, apply, or predict — not recall
- A good sample answer should be provided for self-checking
- Every section deserves at least one checkpoint, even if it is reflective

---

## 7. Interactive Component Design

Interactives are earned, not default. When one is warranted:

- **Parameterized**: the student controls at least one meaningful variable
- **Immediate feedback**: changing input immediately updates output — no "submit" step
- **Annotated**: labels explain what is happening at each step; never leave axes or outputs unlabeled
- **Bounded scope**: one concept clearly, not multiple concepts vaguely
- **White background + color**: do not use dark-mode styling for interactive components

Categories worth building:
- **Parameter slider** — user adjusts a value and observes how a plot or outcome changes
- **Step-through walkthrough** — user advances through an algorithm with real numbers at each step
- **Concept explorer** — user picks a variant and sees a labeled diagram
- **Build-your-own** — user constructs a configuration and sees what it produces

Build the surrounding content *first*. The interactive fills the gap that text leaves; you can't identify the gap until the text exists.

---

## 8. Learning Objectives and Section Overviews

Every chapter should open with explicit learning objectives — specific, testable, and written in the form "you will be able to..." They set the student's expectation for what mastery looks like before they begin. Every section should implicitly serve one or more of those objectives.

---

## 9. Visual and Tone Register

**Voice:** Direct, authoritative, but not dry. The writing models the thinking of a practitioner who finds the material genuinely interesting. Humor and narrative are welcome when they illuminate; they should not distract.

**"Why This Matters in Practice" signals:** When a concept's practical relevance is not obvious from the explanation, make it explicit — either inline, or as a callout. Don't leave the student wondering why they just spent five minutes on something.

**Terminology:** Introduce every technical term precisely when it first appears. Don't introduce a term and then define it three paragraphs later. Don't use a term casually before defining it.

**Math:** Every symbol should be defined when it first appears. Every equation should be accompanied by a prose explanation of what it computes and why. If you can't explain in a sentence why each term of an equation exists, the explanation is not complete.

---

## 10. What to Cut

If you are deciding whether to include something, apply these:
- Does this build toward the two core goals (conceptual understanding or real-world application)? If no, cut.
- Is this detail something a practitioner would actually need to hold? If no, cut or move to a callout.
- Does adding this block make the page feel more coherent, or more exhausting? If the latter, cut.

Density is not the same as rigor. A page that covers fewer concepts with full understanding is more valuable than one that covers many concepts superficially.
