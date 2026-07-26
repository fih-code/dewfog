---
name: dewfog-scout
description: Search for recent, credible research bearing on whether consciousness is fundamental. If something solid turns up, decide whether it earns a new chapter, a substantive update to an existing chapter, or a merge of existing chapters — draft accordingly and get the user's explicit agreement before touching the manuscript — then update the manuscript, rebuild the epub, and sync dewfog.com.
---

# Dewfog Scout

Finds recent, fact-based developments relevant to the book *Consciousness and Reality: A Field Guide to the Open Question* (physics, neuroscience, and philosophy of mind bearing on whether consciousness is fundamental or brain-manufactured). A solid find doesn't automatically become a new chapter — it might better fit as a substantive update to an existing chapter, or even reveal that two existing chapters should be merged. Only with the user's explicit go-ahead does the skill act on whichever of these turns out to be the right shape, keeping the manuscript, the epub, and dewfog.com in sync.

This project's memory already contains durable context worth checking first: `book_is_master_for_site_content`, `dewfog_book_private_repo`, `dewfog_book_epub_rebuild`, `dewfog_book_citation_review`. Read them if present — they carry conventions this skill assumes.

## Conserve what's already established

This project has built up a specific, deliberate set of conventions across both the book and the site. A new chapter or page must read as if it always belonged — never as a bolt-on. Concretely, conserve:

**Editorial voice (book):** lowercase, oblique, experiential rather than explanatory. The author's own established tone — plain language, no equations, short declarative sentences mixed with longer unpacking ones, dashes for asides, direct address to the reader. Don't drift toward a more academic or more mystical register than the existing 21 chapters use.

**Structural pattern (book):** the three-part chapter shape (`## What actually happens` / `## What it doesn't mean` / `## Where this actually touches the question of consciousness`) is load-bearing, not decorative — it *is* the book's method, stated explicitly in the Introduction. Keep the single italic transition sentence between every pair of chapters. Keep the References & Further Reading section organized by topic subheading, in the same citation-detail level as existing entries.

**Diagram style (book):** parchment background (`#FAF8F4`), dark charcoal text (`#2B2B2B`), rust accent (`#8A3B2B`, lighter `#B37361`/`#9F5F52`), italic serif titles, thin leader-line callouts that state an honest caveat rather than just decorating data. Diagrams in this book editorialize toward humility, not toward looking impressive.

**Site design system:** every page is a full-viewport canvas animation on `#0b1316`, using only `TEAL='159,232,219'`, `AMBER='240,198,154'`, `CREAM='255,248,228'`, `Italiana` for the lowercase `<h1>`, `Space Mono` everywhere else. The `#top-nav` (home link + burger + `#nav-links` dropdown), `#status` bar, and `#info` box are identical structural elements on every page — don't invent a new layout primitive for a new page when an existing one already fits.

**Navigation wiring rules (site):** noscript footers are self-inclusive (a page lists itself); interactive `#nav-links` dropdowns are self-exclusive (a page never links to itself there). `index.html`'s `#dewLinks` needs `max-height`/`overflow-y: auto` — it has genuinely broken this way before (entries silently clipped below the viewport); don't let a new page's addition regress that fix. The nav-toggle JS needs both the open-on-click *and* close-on-outside-click handlers — a page has shipped with only the first before and it read as broken.

**The cross-cutting principle:** dewfog.com's copy must never claim more than the book chapter it's drawn from — see `book_is_master_for_site_content`. And within the book itself, a new chapter must hold to the same discipline as all the others: a genuinely neutral, well-sourced fact doesn't get to masquerade as evidence for fundamental consciousness, even when it would be satisfying to let it.

## Ground rules (carry through every step)

- **Never touch `manuscript-full.md` before the user explicitly agrees to the specific chapter draft.** This is the one non-negotiable gate the user asked for. Steps 1–2 are read-only research; step 3 is a hard stop for approval.
- **Never fabricate a citation.** Every claim in a proposed chapter needs a real, independently-checked source (WebSearch/WebFetch to confirm authors, year, journal — the same discipline used in the 2026-07-24 citation review). If you can't verify something, say so instead of writing it in with false confidence.
- **Every specific factual claim in the new chapter gets a matching References & Further Reading entry — no exceptions.** This means every named study, statistic, specific date, or named researcher's finding mentioned in the chapter body must have a corresponding, independently-verified entry in the reference list (added under a fitting topic subheading, per Step 2). Before presenting the draft in Step 3, do a self-check pass over the chapter exactly like the 2026-07-24 citation review did: list every checkable claim, confirm each has a matching reference, and flag (rather than silently drop) anything you couldn't pin to a specific verifiable source. Don't let the same kind of gap that review found recur in a chapter this skill adds.
- **The book's own discipline applies to new chapters too**: established science / correction of the popular misreading / honest philosophical bridge — and don't let a new chapter overclaim toward "consciousness is fundamental" any more than the rest of the book does.
- **Confirm before every `git commit`/`git push`**, in both `/home/fih/Documents/dewfog-book` (private) and `/home/fih/Documents/dewfog` (public) — this has been the standing pattern in this project; don't silently push.
- **dewfog-book is private, dewfog is public.** Never let manuscript/epub content leak into the public repo's history.

## Step 1 — Search

Run WebSearch across the book's topic map, favoring queries scoped to roughly the last 6–12 months. Cover the areas the book already touches, and areas it doesn't yet:
- Consciousness theories: Integrated Information Theory, Global Workspace Theory, panpsychism, idealism, Orch-OR, adversarial-collaboration consciousness studies
- Quantum foundations: measurement problem, decoherence, quantum biology, entanglement in warm/biological systems
- Neuroscience: default mode network, psychedelics/meditation and self-dissolution, near-death experience research, split-brain/disorders of consciousness
- Physics: holographic principle / AdS-CFT extensions to realistic spacetimes, black hole information paradox progress, fine-tuning and multiverse arguments
- Philosophy of mind: personal identity, self-inquiry, perception science (Hoffman-adjacent work), new arguments in the hard-problem literature

Prefer primary sources (peer-reviewed papers, arXiv preprints with real traction) and top-tier science journalism (Quanta Magazine, Nature News, Scientific American, university press releases) over blogs or pop-science summaries. Explicitly deprioritize anything that reads as quantum-mysticism overreach — the book exists specifically to correct that genre, not amplify it.

## Step 2 — Decide the right shape, then draft (still no writes to the manuscript)

For the strongest candidate (or candidates):

1. Verify it independently — pull the actual paper/press release, not just secondary coverage. Confirm authors, year, venue, and that it says what the coverage claims.
2. **Decide what the finding earns before drafting anything.** A scout skill has a built-in incentive to keep finding reasons to add a new chapter — resist that, and weigh all three outcomes honestly:
   - **A new chapter** — the finding is a real, freestanding development that doesn't already have a home in the book, and forcing it into an existing chapter's structure would dilute that chapter's own argument or require a second, unrelated "What actually happens" opening bolted onto the first. (Example: the split-brain synchrony finding — no existing chapter touched split-brain research at all.)
   - **A substantive update to an existing chapter** — the finding directly extends, complicates, sharpens, or corrects a claim an existing chapter already makes. This can be more than a one-line footnote — a new paragraph, a revised "What it doesn't mean," an added diagram — but it stays inside that chapter's existing three-part structure and transitions rather than minting new ones. A useful test: if the finding's natural opening sentence would be something like "a newer study adds to this same picture" or "this complicates a claim from earlier in the chapter" without contorting itself, it's an update, not a new chapter.
   - **A merge of two or more existing chapters** — the new finding is the connective tissue that reveals two existing chapters were really making one argument from two angles, and now visibly overlap or repeat the same setup or the same caveat. Hold this to a real bar: don't propose a merge because two chapters are loosely thematically adjacent ("these are both about the brain") — only when the overlap is genuinely repetitive (the same correction of the same popular myth, done twice; the same philosophical move, argued twice). A merge means combining both chapters' actual content into one three-part chapter, not concatenating them — most of both originals will need trimming to land back in the normal ~700–1100 word range — rewriting the transition sentences on both sides of the *pair* (not just one splice point), and folding both chapters' References & Further Reading entries under one subheading.
   - If nothing found clears the bar for any of the three, say so plainly and stop. Don't force an outcome to justify the search — that would violate the book's own ethos, and an unnecessary update or merge is exactly as much of a violation as an unnecessary new chapter.
3. Once the shape is decided, draft it matching established conventions exactly:
   - **New chapter**: three-part structure (`## What actually happens` / `## What it doesn't mean` / `## Where this actually touches the question of consciousness`), ~700–1100 words, a short evocative chapter title (e.g. "The Antenna, and Its Cracks", "The Sliver That Held"), one italic transition sentence bridging in from the preceding chapter and one bridging out to the next — remember this means **rewriting the preceding chapter's existing transition line**, not just adding a new one. Work out where in the sequence it belongs, with reasoning (what argument thread it extends or complicates) — same approach as the "Personal Identity and Cell Turnover" and "Sliver That Held" placement decisions.
   - **Update to an existing chapter**: show the change as a diff against the current chapter text — exact sentences/paragraphs added, removed, or rewritten — not a fresh chapter-shaped draft. Keep the chapter's existing title, transitions, and overall length in the same range unless the update genuinely requires more room. If it adds a citable claim, it still needs a matching reference entry, same as a new chapter.
   - **Merge**: draft the single resulting chapter in full (three-part structure, ~700–1100 words, one title covering both original topics), plus the two new transition sentences for whichever chapters now flank the merged one. Note explicitly which two chapters are being retired and what, if anything, from each is being cut versus kept.
   - Across all three shapes: if a natural visual fits (comparison, timeline, scale), generate one matplotlib diagram matching the established style: background `#FAF8F4`, dark text `#2B2B2B`, rust accent `#8A3B2B` (lighter `#B37361`/`#9F5F52` for secondary lines), `DejaVu Serif` font, italic serif title, thin leader-line callouts for honesty caveats, saved as `images/fig1_<descriptive_name>.png` in the dewfog-book repo. Study 2–3 existing figures in that folder first for exact conventions before drawing.
   - New "References & Further Reading" entries for every citable claim, added under a fitting topic subheading (create a new one if none fits) — see the ground rule above; this is not optional, for any of the three shapes.
4. Run the citation self-check described in the ground rules: go through the draft claim by claim and confirm each has a matching reference entry. Produce a short pass/fail list (claim → reference, or claim → "unverified, flagged").

## Step 3 — Stop and ask (the required gate)

Present to the user, before writing anything to `manuscript-full.md`:
- What was found and why it's solid (source, verification)
- **Which of the three shapes you're proposing — new chapter, update to an existing chapter, or a merge — and why the other two aren't the better fit.** Don't just present a draft and let the shape be implicit; say it plainly, especially if it's not the default "new chapter."
- The full draft, in whichever form matches the shape (full chapter text; a diff against the existing chapter; or the full merged chapter plus a note on what's being retired from each original)
- The diagram, if any
- The reference entries to add, and the claim-by-claim self-check from Step 2.4 — including anything you couldn't verify, named explicitly rather than smoothed over
- The recommended placement and rationale (for a new chapter or merge), framed as a question, not a fait accompli

Only proceed past this point if the user explicitly agrees — including agreement on the shape itself, not just the content.

## Step 4 — Update the manuscript

- **New chapter**: insert it at the agreed position in `/home/fih/Documents/dewfog-book/manuscript-full.md`, rewriting the preceding chapter's transition line and adding the new chapter's own closing transition.
- **Update to an existing chapter**: apply the agreed diff in place; only touch the transition sentences if the update changes what the chapter now leads into or out of.
- **Merge**: replace the two original chapters with the single new one at the position of whichever came first in the sequence, remove the other, and rewrite the transition sentences on both sides of the resulting single chapter (the sentence leading in from whatever preceded the pair, and the one leading out to whatever followed it).
- Add the reference entries (and remove any that no longer apply, for a merge).
- Confirm, then commit and push to the `dewfog-book` private repo.

## Step 5 — Rebuild and validate the epub

`metadata.yaml` pins a fixed `identifier:` (a UUID) specifically so Apple Books and similar readers recognize every rebuild as an update to the same book rather than a brand-new arrival — without it, pandoc auto-generates a random UUID on every single build, which is exactly what caused a real bug: Apple Books silently kept serving a stale cached copy while newer, verified-clean rebuilds sat unread on the user's device. **Never remove, regenerate, or omit this `identifier:` field when rebuilding the epub** — reuse the existing one as-is. It should only ever change for a deliberate new edition, and never as a side effect of a routine chapter add/update/merge rebuild.

From `/home/fih/Documents/dewfog-book`:
```
LC_ALL=C.utf8 LANG=C.utf8 pandoc metadata.yaml manuscript-full.md \
  -o consciousness-and-reality.epub \
  --epub-cover-image=cover.png \
  --css=style.css \
  --toc --toc-depth=1 \
  --split-level=1
```
Then validate (needs a JRE — `openjdk-21-jre-headless` should already be installed; if `java` is missing, ask the user to install it via Mint's Software Manager as before):
```
java -jar epubcheck-5.1.0/epubcheck.jar consciousness-and-reality.epub
```
Must report 0 fatals/errors/warnings. If the jar isn't present, download it: `curl -sL https://github.com/w3c/epubcheck/releases/download/v5.1.0/epubcheck-5.1.0.zip -o epubcheck.zip && unzip -q epubcheck.zip`. Confirm, then commit and push the rebuilt epub.

## Step 6 — Sync dewfog.com

What this step involves depends on which shape Step 2 landed on:
- **New chapter**: build one new page, as described below.
- **Update to an existing chapter**: no new page — instead revise that chapter's existing page's `#info` teaser copy so it still matches the chapter's exact evidentiary caution post-update (per `book_is_master_for_site_content`), without touching that page's nav wiring.
- **Merge**: build one new page for the merged chapter (as below), then retire the two originals' pages — remove both from every other page's `#nav-links` and noscript footer, from `index.html`'s lists, and from `sitemap.xml`, and delete the two HTML files. Decide with the user whether either old URL should redirect to the new page (dewfog.com has no server-side redirect mechanism currently in place, so this may mean noting the change in `robots.txt`/`sitemap.xml` only, or adding a simple client-side redirect page — flag this as an open question rather than assuming).

For a new page, in `/home/fih/Documents/dewfog`, create one new page (e.g. `topic-slug.html`) following the exact template every existing page uses:
- Full `<head>` boilerplate (meta tags, Italiana + Space Mono fonts, favicon)
- `#ui` overlay: `#top-nav` (home link + burger + `#nav-links` dropdown — copy CSS verbatim from any existing page), `#title-wrap` (lowercase `<h1>` + three-keyword `.subtitle`), `#status`, `#info` (teaser copy locked to the book chapter's exact evidentiary caution — don't paraphrase past what the chapter actually claims), `#vignette`
- Canvas 2D animation, phase-based, using only `TEAL='159,232,219'`, `AMBER='240,198,154'`, `CREAM='255,248,228'` on `#0b1316` background
- noscript footer with every page listed (self-inclusive)

Then wire it into every page's navigation, same as every prior page addition:
- Every existing page's noscript footer (self-inclusive) and `#nav-links` dropdown (self-exclusive — a page never links to itself in the interactive menu)
- The new page's own noscript footer (include itself) and `#nav-links` (list every other page, excluding itself)
- `index.html`'s `#dewLinks` list and noscript nav list — and double check `#dewLinks` still has `max-height`/`overflow-y: auto` (it has clipped entries below the viewport before; don't reintroduce that)
- `sitemap.xml`

Validate: JS syntax check every touched file (`node --check` on extracted `<script>` blocks), serve locally and curl each changed/new page for a 200, confirm nav link counts are consistent across all pages. Confirm, then commit and push to the public `dewfog` repo.

## After completion

Update the relevant memory files (chapter count — which may go up for a new chapter, stay the same for an update, or go down for a merge — latest commit hashes, any newly-open verification items) the same way prior chapter additions were recorded, so the next invocation of this skill has accurate context.
