# CelebrateIT — Dual Wedding Planning Platform

CelebrateIT is a production-grade wedding planning platform built around one core idea: **a bride is planning two weddings, not one.** Many South African brides hold a traditional celebration and a white wedding — separate dates, separate cities, each with its own budget, guest list, vendors, and checklist. Every other planning tool assumes a single wedding; CelebrateIT is built specifically for both.

---

## 🎨 Brand Design Guidelines

- **Colour Palette**:
  - Cream `#F9F5F2` — Page background (always, never pure white)
  - Card White `#FFFFFF` — Containers and interactive card elements
  - Near-black `#1A1816` — Text and primary CTAs
  - Gold `#9E784B` — Primary accent (progress bars, links, highlights)
  - Hairline `#E6DED6` — Dividers and card borders
- **Typography**:
  - `Playfair Display` (serif) — Editorial headings and celebration names
  - `Archivo` (sans-serif) — Body text, numbers, and uppercase section labels
- **Currency**: All monetary values are strictly formatted in South African Rands (e.g., `R265 000`).

---

## 🚀 Key Features

1. **Bride Experience**:
   - **5-Step Onboarding**: Configure Traditional Day and/or White Wedding details, Gauteng region, target dates, and overall budget allocation.
   - **Dual Celebration Workspace**: Isolated budget lines and action checklists for each celebration.
   - **Curated Vendor Search**: Browse local vendors filtered by area (Sandton, Soweto, Johannesburg, Pretoria, Midrand), category, and celebration suitability.
   - **Enquiry Composer**: Auto-fills celebration details so brides never re-type dates or guest counts.

2. **Vendor Portal**:
   - **Self-Serve Listing**: Photo gallery, area selection, starting price, and description.
   - **Auto-Publishing**: Listings automatically go live when completeness score crosses 70% (no manual gatekeeping).
   - **Enquiry Inbox & Booking Sync**: Manage incoming bride threads and mark bookings, which automatically syncs budget lines to the bride's workspace.

3. **Muse AI Planning Assistant**:
   - South African wedding assistant providing budget split advice, date clash warnings, and **live vendor search matching** with anti-hallucination guardrails.

4. **Founder / Admin Portal**:
   - Real-time platform metrics, supply gap tracking (`SearchMiss` logs), and vendor network pause/restore controls.

---

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite 8
- **Styling**: Tailwind CSS 4 (`@theme` customized variables)
- **Fonts**: Google Fonts (`Playfair Display`, `Archivo`)
- **Icons & Assets**: Custom SVG icons & curated photography

---

## 🏃 Getting Started

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

---

## 📜 Full Product Specification & Master Roadmap

Below is the complete architectural specification and build brief for CelebrateIT:

### Roles & Access Control
- **Bride**: Demand-side user. Plans budget/checklist/timeline per celebration, browses vendors, sends enquiries, and tracks bookings.
- **Vendor**: Supply-side user. Builds self-serve listings, appears in search, receives and replies to enquiries.
- **Admin (Founder)**: Platform metrics, enquiry volume, supply gaps by category/area, and listing moderation.

### Data Models & Relationships
- `User` (id, name, email, role: BRIDE | VENDOR | ADMIN)
- `Wedding` (id, brideId, overallBudget, style, colours[])
- `Celebration` (id, weddingId, type: TRADITIONAL | WHITE, date, area, budget, guestCount)
- `BudgetLine` (id, celebrationId, category, planned, actuallySpent, linkedVendorId)
- `ChecklistItem` (id, celebrationId, title, dueDate, done)
- `VendorProfile` (userId, businessName, category, areasServed[], celebrationsServed, priceFrom, description, completenessScore, isLive)
- `Enquiry` (id, brideId, vendorId, celebrationId, status, createdAt)
- `SearchMiss` (id, category, area, createdAt)

