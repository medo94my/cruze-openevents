# Cruze Events — Design System

**Audience:** Qataris, expat residents, visiting families and international communities in Qatar. **Promise:** discover local experiences, feel welcome, and make memories. Avoid generic B2B event-management copy.

## Brand

| Token | Example |
| --- | --- |
| Qatar-inspired maroon | `#641633` |
| Text / ink | `#271D20` |
| Warm cream background | `#FBF8F3` |
| Sand-colored surface | `#F1E8DD` |
| Pale gold highlight | `#F3D1AC` |

Style: expressive editorial headlines, generous white space, elegant rounded cards, high-quality licensed photos and welcoming copy. Use maroon for primary action and navigation. Avoid heavy gradients that obscure text, false urgency, fake reviews and unverified venue partnerships.

## Customer journey and information hierarchy

1. **Homepage:** instantly say what Cruze is and where it operates. Feature a human, memorable image; clear search and discover action.
2. **Highlighted experiences:** larger photographic feature supported by small editorial tiles.
3. **Discover:** filter by music, food/culture, arts, family, wellness, outdoor experiences and meetups; search terms; Friday/Saturday weekend; free events.
4. **Event card:** photo, date in Qatar time, location, title, QAR starting price and clearly distinguishable demo status.
5. **Event detail:** all relevant schedule, venue, organizer, price and terms. Purchase only when genuinely available and verified.
6. **Header/footer:** discover, weekend, account/dashboard (when appropriate), support/legal links; never pitch third-party event publishing to consumers.

Existing main customer UI: `src/components/landing/CruzeHome.tsx`; layout: `src/components/layout/`; route pages: `src/app/(public)/`. Reuse current styles rather than rebuilding from scratch.

## Arabic, English and RTL

- Translate all navigational controls, validation errors and labels, without machine-overwriting event titles.
- Set `lang` and `dir` appropriately at the interface/document boundary. Audit RTL alignment, input direction and arrows.
- Use CSS logical directions (`start/end`, `ms/me`, etc.) where possible.
- Keep URLs, contact emails and some embedded numbers LTR when necessary.
- Ensure Arabic fonts work at the same line height, in text truncation and in large headlines.
- The existing homepage bilingual toggle does **not** imply that the rest of checkout/auth/admin is fully localized. Track gaps explicitly.

## Qatar conventions

- QAR currency and real pricing; no artificial price scarcity.
- Dates and times in `Asia/Qatar`. The local weekend is **Friday/Saturday**.
- Feature realistic Doha-area experiences while respecting social, cultural and accessibility needs.
- Do not represent fictional demo listings as real events; clearly label them and keep checkout disabled.

## Accessibility and responsiveness

Aim for WCAG 2.2 AA: accessible contrast, focus visible, semantic landmarks and form labels, meaningful alt text for informative images, 44px-ish touch targets, keyboard-operable menus/filters, reduced-motion support and screen reader feedback. Test at 375px and 1440px, on both LTR and RTL. Avoid layout shifts through aspect ratios; lazy-load lower image grids. Preserve the user’s filters when changing the display language.

## Acceptance before merging frontend changes

- Header, homepage, /events catalogue and event details look cohesive.
- Search and date/category/free filters actually work, including empty states.
- Cards remain readable on mobile and overlays maintain contrast.
- English and Arabic layouts are usable, including keyboard navigation.
- All fictional events remain explicitly marked and non-purchasable.
- Any newly introduced asset is licensed or owned and has a documented source.
