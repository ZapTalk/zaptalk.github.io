 

# Build Zaptalk: Bitcoin-only English Learning App (React + Nostr)

You are GitHub Copilot. Generate production-ready code for **Zaptalk**, a React app for learning English. It’s similar to “HamyarZaban” but **all purchases are Bitcoin zaps**. Users unlock lessons, sections, or levels **only after a successful zap (NIP-57)**. Deliver clean, typed, testable code.

## Tech Stack & Conventions

* **React + Vite + TypeScript**
* **UI**: TailwindCSS + shadcn/ui (Button, Card, Accordion, Dialog, Tabs, Progress)
* **State**: Zustand (lightweight global store)
* **Routing**: React Router
* **i18n**: en, ar, fa via `i18next` (RTL support)
* **PWA**: manifest + service worker (offline caching for lessons metadata, not premium content)
* **Nostr**:

  * Login via **NIP-07** browser extension if available; otherwise local key (only for dev).
  * Payments via **NIP-57 zap** flow; also support **WebLN** invoice fallback (LNURL/Lightning invoice) if zap not available.
* **Backend (minimal)**: use **Supabase** (or PocketBase) only for user profile + entitlement mirrors; treat Nostr as source-of-truth for purchases. Provide env toggles to run **pure-client demo** (no backend).
* **Coding**: Strict TS, ESLint + Prettier, absolute imports `@/*`.
* **Security**: Never store private keys. Use NIP-07 signing only. Validate zap receipts against relays.

## High-Level Features

1. **Landing (public):** hero, benefits, ratings, FAQ accordion (like screenshots), CTA: “Start free” and “Unlock with Bitcoin ⚡”.
2. **Auth:** Sign-in with Nostr (NIP-07). If no extension, allow “Continue as guest” (read-only free lessons).
3. **Catalog:** Levels A1–C2 → modules → lessons. Each lesson shows lock/unlock state and price in sats.
4. **Player:** Lesson page with tabs: *Learn* (text/audio), *Practice* (quiz), *Story* (short story). Track progress locally and sync if logged in.
5. **Payments:**

   * Button **“Unlock with Zap ⚡”**.
   * Create NIP-57 zap request to the app’s `pubkey` with `amount` and tags identifying the SKU.
   * On success, write an **entitlement event** (kind 30009) and verify via relay. Fallback: WebLN invoice → confirm via webhook (mock adapter) → mark unlocked.
6. **Profile:** progress, badges, owned SKUs, receipt viewer (links to Nostr events).
7. **Admin (local only for now):** define SKUs (lesson/section/level), price, and visibility.

## Data Model (TypeScript)

Create types and JSON stubs to seed demo content.

```ts
type LevelCode = 'A1'|'A2'|'B1'|'B2'|'C1'|'C2';

interface Lesson {
  id: string;           // e.g., "A1-L01"
  level: LevelCode;
  moduleId: string;     // e.g., "A1-M03"
  title: string;
  kind: 'grammar'|'reading'|'listening'|'speaking'|'vocab'|'story';
  isFree: boolean;      // free preview
  priceSats: number;    // 0 for free
  durationMin: number;  // ~5 minutes target
  content: {
    html?: string;
    audioUrl?: string;
    quiz?: QuizItem[];
  };
}

interface Module {
  id: string;           // "A1-M03"
  level: LevelCode;
  title: string;
  lessonIds: string[];
}

interface Level {
  code: LevelCode;
  title: string;        // "Beginner A1"
  moduleIds: string[];
}

interface Sku {         // purchasable unit
  id: string;           // "sku-lesson-A1-L01" | "sku-level-A1"
  type: 'lesson'|'module'|'level';
  refId: string;        // maps to lesson/module/level id
  priceSats: number;
  displayName: string;
}

interface Entitlement {
  skuId: string;
  grantedAt: string;
  source: 'nostr-zap'|'webln-invoice';
  nostrEventId?: string;
}
```

## Nostr & Payments

Implement a **payments layer** with a clean interface and two adapters.

```ts
// src/lib/payments/types.ts
export interface ZapRequest {
  amountSats: number;
  skuId: string;
  memo?: string;
  userPubkey: string;
}

export interface PaymentResult {
  ok: boolean;
  nostrEventId?: string;
  error?: string;
}

export interface PaymentsProvider {
  zap(req: ZapRequest): Promise<PaymentResult>;
  invoice(req: ZapRequest): Promise<{ invoice: string }>;
}
```

**Adapters:**

* `NostrZapProvider` (default):

  * Build zap request (NIP-57) to `APP_PUBKEY` with tags:
    `["t","zaptalk"]`, `["sku", skuId]`, `["user", userPubkey]`.
  * Await wallet confirmation; on success, return `PaymentResult` with `nostrEventId`.
* `WebLNInvoiceProvider` (fallback):

  * Create Lightning invoice (mock or LNbits/BTCPay configurable via `.env`).
  * Expose a polling hook `useInvoiceStatus` to detect payment settled.

**Verification & Entitlements**

* After payment, **verify** by querying configured relays for the zap/receipt event.
* If found (or invoice settled), grant entitlement in client store; if `SUPABASE_URL` set, mirror to table `entitlements(user_pubkey, sku_id, nostr_event_id, granted_at)`.
* Utility: `hasAccess(user, skuId)`, recursive checks (e.g., owning a level grants all lessons within).

## Pages & Routes

```
/                         Landing
/catalog                 Levels grid (A1..C2)
/catalog/:level          Modules list
/lesson/:lessonId        Lesson player (locked/free)
/profile                  Progress, purchases, receipts
/admin (dev only)         Manage SKUs/content (local json)
```

## Key Components (generate with tests)

* `Navbar`, `Footer`, `LanguageSwitcher`
* `LevelCard`, `ModuleCard`, `LessonCard`
* `LockBadge` (shows “Free” or price in sats)
* `ZapPayButton` (core payment CTA)
* `EntitlementGuard` (HOC that gates content)
* `FAQAccordion` (replicate style from screenshots; shadcn Accordion)
* `StoryReader` (story with line-by-line translation toggle)
* `QuizRunner` (MCQ & gap-fill; save local progress)
* `ProgressRing` (per-lesson completion)
* `Toast` notifications

## Stores & Hooks

* `useAuthStore`: `{ pubkey, isGuest, loginWithNostr(), logout() }`
* `useCatalogStore`: levels/modules/lessons loading + filters
* `useEntitlementsStore`: `grant(skuId, meta)`, `has(skuId)`, persistence to `localStorage`
* `useZapPurchase(skuId)`: orchestrates zap → verify → grant
* `useRTL()` and i18n init: auto-set dir=rtl for ar/fa

## UI/UX Requirements

* **5-minute lessons**: show time badge and streak booster.
* Show **OMR ≈ sats** helper (convert using configurable rate; do NOT call external APIs in codegen).
* On locked content: blur + overlay with “Unlock with Bitcoin ⚡ [price sats]”.
* After success: celebratory modal + “Share on Nostr” button (post kind-1 with hashtag `#Zaptalk`).
* **Accessibility**: keyboard focus, aria labels, reduced motion option.

## FAQ Section (seed)

Replicate cards from the screenshot:

* “What does this app do for me?”
* “I’m a beginner—will it help?”
* “Who is it for?”
* “What standard do you follow?” (CEFR A1–C2)
* “Will teachers support me along the way?”
  Use `Accordion` with RTL support.

## Internationalization

* Default language: **en**. Provide demo bundles for **ar** and **fa** (RTL).
* Persist language in `localStorage`. Toggle in navbar.

## PWA

* `manifest.webmanifest` (name, icons, theme color).
* Service worker to cache shell + public lesson metadata; never cache premium content behind a paywall.

## Configuration (.env)

```
VITE_APP_NAME=Zaptalk
VITE_APP_PUBKEY=NPUB_APP_PUBKEY_HERE
VITE_RELAYS=wss://relay.damus.io,wss://nos.lol
VITE_ENABLE_SUPABASE=false
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_PAYMENT_MODE=nostr-first   # or invoice-only
VITE_PRICE_A1=20000
VITE_PRICE_A2=30000
# ...
```

## File Structure (generate)

```
src/
  app.tsx
  main.tsx
  routes/
    landing.tsx
    catalog.tsx
    level.tsx
    lesson.tsx
    profile.tsx
    admin.tsx
  components/
    ui/...(shadcn)
    faq/FAQAccordion.tsx
    payments/ZapPayButton.tsx
  lib/
    nostr/ (connect, sign, fetchEvents)
    payments/ (types.ts, nostrZap.ts, weblnInvoice.ts, verify.ts)
    i18n/ (init.ts, resources.ts)
    pwa/ (sw.ts)
  stores/
    auth.ts
    catalog.ts
    entitlements.ts
  data/
    levels.json
    modules.json
    lessons/*.json  (seed with few demo lessons)
  styles/index.css
```

## Sample Flows (implement)

**Zap purchase flow**

1. User opens locked lesson → clicks `ZapPayButton`.
2. If NIP-07 available: create zap request → wallet popup → on success get event id.
3. Verify event via relays (fetch by tag `["sku", skuId]` and payer pubkey).
4. `grant(skuId)` → unlock lesson → toast “Access granted”.

**Invoice fallback**

1. Generate invoice via provider (mock).
2. Show QR & Lightning URI; poll status.
3. On “settled” → `grant(skuId)`.

**Entitlement resolution**

* `hasAccess(user, lessonId)` returns true if:

  * owns `sku-lesson-<lessonId>` **OR**
  * owns `sku-module-<moduleId>` **OR**
  * owns `sku-level-<level>` **OR**
  * lesson `isFree`.

## Testing

* Vitest + React Testing Library.
* Unit tests: `hasAccess()`, `useZapPurchase()`, `EntitlementGuard`.
* Component tests: `FAQAccordion`, `ZapPayButton`.

## Deliverables

* Full project scaffold with running demo (seed: A1 level with 3 lessons; one free, two paid).
* Scripts: `dev`, `build`, `preview`, `test`.
* README with setup, env, and Nostr payment notes.

## Acceptance Criteria

* Can browse levels/modules/lessons and see lock states.
* Can sign in with Nostr (if extension present) or continue as guest.
* Clicking **Unlock with Bitcoin ⚡** performs zap or invoice flow; on success lesson unlocks immediately and persists across reloads.
* Entitlements verified from relays and mirrored to Supabase when enabled.
* i18n switch works (en/ar/fa), RTL correctly flips layout.
* PWA installable; offline shell works.
* Code is typed, linted, and covered by basic tests.

---

**Extra:** After generation, create a minimal seed:

* Levels: A1 only
* Modules: A1-M01 “Essentials”
* Lessons:

  * A1-L01 (free) “Alphabet & Sounds”
  * A1-L02 (paid) “Basic Greetings” (2000 sats)
  * A1-L03 (paid) “Numbers & Time” (2000 sats)

 