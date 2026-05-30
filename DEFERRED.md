# 📕 Deferred Items Book — "Build Later on VPS"

This is the **memory ledger** for features we are **NOT building now** because the site
must run on **cheap shared hosting** (static export, no Node server, no database).

When the project moves to a **VPS / Node backend** in the future, we revisit this list
and build these properly. **Nothing here is forgotten — it is parked, not dropped.**

> Rule of thumb: anything needing a *server process*, a *database*, *secret API keys*,
> *user login*, or *online payment* lives here until we have a VPS.

---

## 🔴 Needs backend / VPS (cannot do on shared hosting)

| # | Item | Why it needs a server | Shared-hosting workaround we use NOW |
|---|------|----------------------|--------------------------------------|
| 1 | **Rental booking + payment + inventory** | Real-time stock, online payment, order records → needs DB + server | Browse catalog (static) → **"Inquire" via WhatsApp / email**. No live booking. |
| 2 | **Membership / paid expert advice** | Login/auth, payment gating, gated content delivery → needs DB + auth | External payment link + **manual delivery**; advice request sent via WhatsApp/email. |

---

## 🟡 Parked for now (decision: do later, not a hosting limit)

_(empty — add here when we consciously postpone something that COULD be done now)_

---

## 🟢 Build-now constraints & special handling (NOT deferred — just notes on HOW we build now)

These are being built now, but with a specific approach because of current business state:

- **Rent-a-bike (150cc)** — Bikes are **not available yet**. Build the full UI/section now
  but mark it **"Coming Soon"** until inventory exists.
- **Road conditions** — No reliable free API. Build a **"Request live road condition"** flow:
  user clicks → sees a **loading/wait state** → we (the team) **manually look it up and
  reply** (via WhatsApp/email, or a value we paste in). Front-end shows a graceful wait timer.
- **Gear / camps / accessories catalog** — Display-only catalog with photos. Acquisition =
  WhatsApp/email inquiry (no checkout). Real cart/checkout = see item #1 above.

---

## 📇 Contact channels used for all "inquiry" workarounds
- **WhatsApp / Call:** +92-300-9618442
- **Email:** info@dare2gear.pk  _(placeholder until domain confirmed — change if domain changes)_

---

_Last updated: 2026-05-31. Add new deferred items with a date + the reason they can't ship on shared hosting._
