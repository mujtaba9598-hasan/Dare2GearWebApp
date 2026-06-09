# Domain Transfer — Hostinger account → Hostinger account

**Status:** ⏳ WAITING. Hostinger says a new domain must age **at least 4 days** before it can be moved.
**Earliest we can do this:** **2026-06-09** (logged 2026-06-05). Do it in the next session after that date.

**Goal:** Move the **domain registration** out of Hostinger Account #1 (Gmail #1, where the
domain was bought) into Hostinger Account #2 (the one with the **paid hosting**), so the domain
and hosting live under one login.

---

## Key facts (why this is the easy kind of transfer)

- Both accounts are Hostinger → this is an **internal transfer ("push")**, NOT a registrar-to-registrar transfer.
- ✅ No 60-day ICANN lock, ✅ no EPP/auth code, ✅ no registration time lost, ✅ free, usually minutes–hours.
- The only wait is Hostinger's **~4-day new-domain hold** (the reason we're pausing).
- You need access to **both accounts / both email inboxes**: Account #1 = sender, Account #2 (hosting) = receiver.

---

## Method 1 — Self-service in hPanel (try first)

**In the account that OWNS the domain (Gmail #1):**
1. Log in at **hpanel.hostinger.com**.
2. Top menu → **Domains** → **Manage** next to the domain.
3. Left sidebar → **Domain Transfer** → **"Transfer to another Hostinger account"**
   (may appear as **Move domain** or under a **⋯ / Settings** menu).
4. Enter the **email of Account #2** (the hosting account).
5. Confirm — Hostinger sends a confirmation request to the receiving account.

**In the receiving account (hosting):**
6. Log in → accept the **pending transfer request** (also emailed).
7. Done — domain now sits with the hosting.

> If the option is missing/greyed out → use Method 2.

---

## Method 2 — Hostinger Live Chat (most reliable; recommended)

1. Log into the **domain-owning account (Gmail #1)**.
2. **Help / "?"** icon (top-right) → **Contact us / Live Chat** → Kodee → ask for a human agent.
3. Say exactly:
   > "Please move my domain **<DOMAIN>** from this Hostinger account to my other Hostinger
   > account, email **<ACCOUNT #2 EMAIL>**, which has my paid hosting."
4. Verify ownership (you're logged in). They may ask you to **confirm from Account #2's email** — keep it open.
5. They complete the push in-session.

---

## After the domain is in the hosting account — connect it

1. Hosting account → **Hosting → Manage** (your plan).
2. **Add website / Connect domain** → pick the domain.
3. Accept Hostinger's nameservers (`ns1.dns-parking.com` / `ns2.dns-parking.com`); DNS links automatically since same account.
4. Set up **email + SSL** (free SSL auto-issues). Allow up to ~24h for full DNS/SSL propagation (usually faster).

---

## Pre-flight checklist before starting (on 2026-06-09+)

- [ ] 4-day hold has passed.
- [ ] Domain not expired / not about to expire (renew first if close).
- [ ] Logged into BOTH accounts, both inboxes accessible.
- [ ] Note down any existing **DNS records to preserve** (e.g. email MX records) before changing nameservers.

---

## Fill in before next session

- **Domain name:** ____________________
- **Account #1 email (owns domain):** Gmail #1 — ____________________
- **Account #2 email (has hosting):** ____________________
