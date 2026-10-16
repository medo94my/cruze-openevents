# Cruze Events — Design and UI Requirements

## Current implementation

The main customer UI uses a dark editorial style: charcoal #11110f, cream #f1efe8 and orange #d8763d, large uppercase headings, monospace metadata, fine borders and photographic event cards. The root layout loads Outfit and defaults platform_theme to dark. Platform settings retain a separate maroon brand-color default (#8A1538); some customer components hardcode their colors.

Primary sources: src/components/landing/CruzeHome.tsx, src/components/events/EventsBrowser.tsx, src/app/(public)/events/[slug]/page.tsx, src/components/layout/, src/app/globals.css and src/components/seatwise/. The older maroon/cream palette is not a description of the current main UI. Preserve the current visual direction unless a redesign is requested.

## Product and content

Cruze serves Qataris, residents and visitors discovering Qatar experiences. Staff curate events. Avoid consumer-facing organizer marketplace copy.

Event cards should communicate image, Qatar date/time, location, title, actual QAR pricing and availability. Demo events are fictional and must be clearly distinguished. Current static fallback cards and demo checkout do not consistently enforce that boundary; see [Architecture](ARCHITECTURE.md). Never invent confirmations, reviews, venue partnerships, seating guarantees or ticket scarcity.

Current discovery supports category, location and text filtering in EventsBrowser; database categories are heuristically derived from descriptions. Do not describe a complete category taxonomy, date/weekend/free filter set or assigned-seat inventory as implemented.

## Qatar and localization requirements

- New prices default to QAR; display dates/times in Asia/Qatar.
- Friday/Saturday is the local weekend.
- Support English and Arabic with usable RTL, including labels, navigation, errors and form controls.
- Set lang/dir at the document or interface boundary, use logical CSS directions, and retain LTR treatment for URLs/emails where appropriate.
- Test Arabic fonts, heading wrapping, truncation, numbers and directional controls.
- Preserve filters when changing language.

The root currently sets lang=en and the inspected main customer components are English. Application-wide Arabic/RTL and all Qatar-specific filters remain requirements, not completed features.

## Accessibility and motion

Aim for WCAG 2.2 AA: contrast, visible focus, keyboard-operable menus/forms, labels, semantic landmarks, meaningful image alternatives, screen-reader feedback and usable touch targets. Respect prefers-reduced-motion for particle/gallery effects. Reserve image space to limit layout shifts.

Check mobile at 375px and desktop at 1440px, keyboard-only use and both language directions when localization changes. The global camera=() permission policy currently conflicts with camera scanning; scanner changes require reviewing that header.

## Acceptance for UI changes

- Homepage, discovery, event detail, checkout and navigation remain coherent.
- Search/filter behavior and empty states match visible controls.
- Mobile cards, overlays and long event titles remain readable.
- Images are owned/licensed and their source is documented.
- Demo labels/sandbox constraints are explicit; no real charges or misleading tickets.
- Claims about language support, seating, availability or payments are backed by implementation and verification.

This document records requirements and observed code, not a completed accessibility audit.
