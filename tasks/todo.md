# Calendar App - Tailwind CSS v4 Migration Plan

## Previous Implementation
All 13 original tasks completed (calendar app fully functional).

---

## Tailwind CSS Migration Tasks

### 1. Add Tailwind CSS v4 Play CDN to index.html ✓
- [x] Add `<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>` to `<head>`
- [x] Add `<style type="text/tailwindcss">` block with custom `@theme` for the Google Calendar color palette
- [x] Remove the `<link rel="stylesheet" href="style.css">` reference

---

### 2. Convert toolbar (header) to Tailwind classes ✓
- [x] Replace `.toolbar`, `.toolbar-left`, `.toolbar-center`, `.toolbar-right` with Tailwind flex/padding/border utilities
- [x] Replace `.today-btn`, `.icon-btn`, `.month-title`, `.create-btn` with Tailwind equivalents

---

### 3. Convert layout & sidebar to Tailwind classes ✓
- [x] Replace `.layout`, `.sidebar`, `.mini-cal` styles with Tailwind flex/width/border/padding

---

### 4. Convert calendar grid & day cells to Tailwind classes ✓
- [x] Replace `.day-headers`, `.day-header` with Tailwind grid utilities
- [x] Replace `.calendar-grid` with `grid grid-cols-7 grid-rows-6`
- [x] Replace `.day-cell`, `.day-number`, `.event-chip` with Tailwind utilities

---

### 5. Convert modal to Tailwind classes ✓
- [x] Replace `.modal-overlay`, `.modal`, `.modal-header` with Tailwind fixed/flex/bg/shadow
- [x] Replace form styling (`.title-input`, `.form-group`, `.form-row`, etc.) with Tailwind utilities
- [x] Replace button styles (`.btn-save`, `.btn-delete`, `.btn-cancel`) with Tailwind

---

### 6. Update JavaScript class references ✓
- [x] Update `app.js` modal open/close to toggle `hidden`/`flex` instead of `.open`
- [x] Update delete button to toggle `hidden`/`inline-flex` instead of `.visible`
- [x] Update error handling to swap `border-b-gcal-border`/`border-b-gcal-red` classes
- [x] Update Escape key check from `.open` to `!hidden`
- [x] Ensure dynamically created elements (day cells, event chips, mini calendar) use Tailwind classes
- [x] Keep `day-cell`, `event-chip`, `outside`, `mini-cal-btn`, `mc-day` as JS hook classes

---

### 7. Add responsive Tailwind breakpoints ✓
- [x] Replace `@media (max-width: 768px)` rules with `max-md:` prefix utilities
- [x] Replace `@media (max-width: 480px)` rules with `max-sm:` prefix utilities
- [x] Sidebar hidden on mobile: `max-md:hidden`
- [x] Today button hidden on small: `max-sm:hidden`
- [x] Create button collapses to icon: `max-md:p-2 max-md:rounded-full`
- [x] Day numbers scale down: `max-md:w-[22px]`, `max-sm:w-5`
- [x] Event chips scale down: `max-md:text-[0.6rem]`

---

### 8. Clean up style.css and final testing ✓
- [x] Deleted `style.css` (all styling now handled by Tailwind)
- [x] Kept `@keyframes modal-in` in the `<style type="text/tailwindcss">` block
- [x] All features preserved: navigation, event CRUD, modal, responsive

---

## Review

### Summary of Changes

**Migrated entire calendar app from custom CSS to Tailwind CSS v4** using the Play CDN (`@tailwindcss/browser@4`).

**index.html:**
- Added Tailwind v4 Play CDN script tag
- Defined custom `@theme` with Google Calendar color tokens (`gcal-blue`, `gcal-red`, `gcal-text`, `gcal-border`, etc.)
- Replaced all 475 lines of custom CSS class styling with inline Tailwind utility classes
- Used `max-md:` and `max-sm:` breakpoints for responsive design
- Modal uses `hidden`/`flex` toggle instead of custom `.open` class
- Removed `<link>` to `style.css`

**app.js:**
- `renderCalendar()`: Day cells, day numbers, and event chips now use Tailwind utility class strings built conditionally
- `renderMiniCal()`: Mini calendar HTML template uses Tailwind classes; `mc-day` and `mini-cal-btn` kept as JS hook classes
- `openModal()`/`closeModal()`: Toggle `hidden`/`flex` on overlay, `hidden`/`inline-flex` on delete button
- `clearErrors()` and validation: Swap border color classes (`border-b-gcal-border` ↔ `border-b-gcal-red`)
- Escape key handler: Checks `!modalOverlay.classList.contains('hidden')` instead of `.contains('open')`

**style.css:**
- Deleted entirely — all styling is now in Tailwind utilities + the `@theme` block
