# Kova Living — Build Plan

## Brand
- **Name:** Kova Living
- **Vibe:** Dark luxe
- **Fonts:** Cormorant Garamond (headings) · DM Sans (body)
- **Palette:** `#F5F0E8` cream · `#C8A97A` tan · `#181511` dark
- **Taglines:**
  - Hero: "Crafted to last. Designed for life."
  - Product/configurator: "Made to order. Built to stay."

---

## Image sourcing (Unsplash)

Download 3 images per product. Consistent style: neutral/white backgrounds, natural light, slightly elevated three-quarter view.

| Product | Unsplash search terms |
|---|---|
| Kova Modular Sofa | `modular sofa neutral linen` · `sectional sofa white background` |
| Kova Lounge Chair | `lounge chair minimal studio` · `armchair boucle white` |
| Aldren Coffee Table | `oak coffee table minimal` · `wood coffee table white background` |
| Lune Bed Frame | `platform bed frame oak minimal` · `low bed frame bedroom` |
| Aldren Nightstand | `wood nightstand minimal bedside` |
| Sable Dresser | `dark wood dresser bedroom` · `ebony dresser brass handles` |
| Kova Dining Table | `oak dining table minimal` · `solid wood dining table studio` |
| Sato Dining Chair | `dining chair upholstered minimal` · `wood dining chair neutral` |

**Upload to:** Supabase Storage → create a bucket called `product-images` → upload per product folder.
Then update each product row: `images` column = array of public URLs.

---

## Pages status

| Page | Status |
|---|---|
| `/` Homepage | TODO — hero + featured products |
| `/products` Listing | ✅ Done |
| `/products/[slug]` Detail + configurator | ✅ Done |
| `/cart` Cart | ✅ Done |
| `/orders` Order history | ✅ Done |
| `/admin` Admin dashboard | TODO |
| Auth (Google OAuth) | ✅ Done |

---

## Features status

| Feature | Status |
|---|---|
| Product configurator (swatches + toggles + live price) | ✅ Done |
| Cart state (add, remove, qty) | ✅ Done |
| QR code config sharing | Placeholder only — implement later |
| Order placement | Disabled (demo notice) |
| Admin order management | TODO |

---

## Remaining work

1. Homepage (hero + featured products row)
2. Admin dashboard (order list + status controls)
3. Wire in real product images once sourced
4. QR code implementation (encode selected options → URL → QR modal)
5. Performance audit + Lighthouse scores
6. Deploy to Vercel + case study write-up
