# Calendar App - Implementation Plan

## Tasks

### 1. Create project skeleton (index.html, style.css, app.js) ✓
- [x] Create `index.html` with HTML5 boilerplate, links to style.css and app.js
- [x] Include semantic structure: header (month/year + nav buttons), calendar grid container, modal container
- [x] Create empty `style.css` and `app.js` files

**Acceptance Criteria:**
- Opening index.html in a browser shows a blank page with no console errors
- All three files are linked and loading

---

### 2. Implement calendar grid rendering ✓
- [x] Track current month/year in a state variable
- [x] Write `renderCalendar()` that builds a 7-column grid of day cells (42 cells total)
- [x] Display day-of-week headers (Sun-Sat)
- [x] Fill leading/trailing empty cells for days outside the current month
- [x] Display the month and year in the header ("February 2026")
- [x] Highlight today's date with a distinct visual style

**Acceptance Criteria:**
- Grid shows correct number of days for the current month
- Days start on the correct weekday column
- Today's date is visually distinct
- Month/year heading is accurate

---

### 3. Implement month navigation (prev/next) ✓
- [x] Add click handlers to prev/next buttons
- [x] Prev decrements month, next increments month
- [x] Re-render the calendar grid after navigation
- [x] Handle year boundary (Dec → Jan, Jan → Dec)

**Acceptance Criteria:**
- Clicking next from December 2026 shows January 2027
- Clicking prev from January 2026 shows December 2025
- Grid re-renders correctly for every month
- Today highlight only appears when viewing the current month

---

### 4. Implement localStorage event storage ✓
- [x] Define event data shape: { id, title, date, time, description }
- [x] Write `getEvents()` to read and parse from localStorage
- [x] Write `saveEvents(events)` to serialize and store
- [x] Write `addEvent(data)` that generates a UUID, appends, and saves
- [x] Write `updateEvent(id, data)` that finds and updates by ID
- [x] Write `deleteEvent(id)` that removes by ID and saves
- [x] Handle empty/corrupt localStorage gracefully (default to empty array)

**Acceptance Criteria:**
- Events persist after page reload
- Adding, updating, and deleting events are reflected in localStorage
- If localStorage contains invalid JSON, app does not crash

---

### 5. Display events on the calendar grid ✓
- [x] After rendering day cells, query events matching each day's date
- [x] Render event chips (small pills showing event title) inside the day cell
- [x] Truncate long titles with ellipsis
- [x] Make event chips clickable (for editing)

**Acceptance Criteria:**
- Events appear on the correct day cell
- Long titles are truncated with ellipsis
- Multiple events on the same day stack vertically

---

### 6. Build the event modal (HTML + CSS) ✓
- [x] Add modal markup: overlay backdrop + dialog box
- [x] Add form fields: title (text), date (date), time (time), description (textarea)
- [x] Add Save, Delete, and Cancel buttons
- [x] Style the modal: centered, max-width 480px, rounded corners, shadow
- [x] Modal hidden by default
- [x] Add open/close animation (opacity + translateY)

**Acceptance Criteria:**
- Modal is not visible on page load
- When shown, modal is centered with semi-transparent backdrop
- All form fields are present and labeled
- Modal looks clean and modern

---

### 7. Implement Add Event flow ✓
- [x] Clicking a day cell opens the modal with date pre-filled
- [x] Delete button hidden in "add" mode
- [x] On submit: validate, call addEvent(), close modal, re-render grid
- [x] Clear form fields after successful add

**Acceptance Criteria:**
- Clicking a day cell opens the modal with date pre-filled
- After saving, event chip appears on the correct day
- Modal closes after successful save

---

### 8. Implement Edit Event flow ✓
- [x] Clicking an event chip opens the modal pre-filled with event data
- [x] Delete button visible in "edit" mode
- [x] On submit: validate, call updateEvent(), close modal, re-render grid
- [x] Track editing via editingEventId variable

**Acceptance Criteria:**
- Clicking an event chip opens modal with all fields pre-filled
- Saving updates the existing event (no duplicate)
- Updated event reflected on grid immediately

---

### 9. Implement Delete Event flow ✓
- [x] Delete button calls deleteEvent() with the current event ID
- [x] Close modal and re-render grid after deletion

**Acceptance Criteria:**
- Clicking Delete removes the event from localStorage and the grid
- Modal closes after deletion

---

### 10. Implement form validation ✓
- [x] Title: required, show error if empty
- [x] Date: required, show error if empty
- [x] Display inline error messages below the relevant field
- [x] Clear errors when user corrects input or modal reopens
- [x] Prevent submission if validation fails

**Acceptance Criteria:**
- Empty title shows "Title is required"
- Empty date shows "Date is required"
- Errors disappear when corrected
- Valid submissions proceed normally

---

### 11. Implement modal close behaviors ✓
- [x] Cancel button closes the modal
- [x] Clicking the backdrop closes the modal
- [x] Pressing Escape closes the modal
- [x] Reset form and clear errors on close

**Acceptance Criteria:**
- All three close methods work
- Reopening modal after cancel shows a clean form

---

### 12. Implement responsive design ✓
- [x] Calendar grid cells adapt to narrow screens
- [x] Event chip text truncates more on small screens
- [x] Modal goes near-full-width on mobile
- [x] Font sizes scale down on mobile
- [x] Test at 375px and 1024px+

**Acceptance Criteria:**
- At 375px width, calendar is usable without horizontal scroll
- Day cells are tappable on mobile
- Modal is readable on mobile

---

### 13. Final polish and review ✓
- [x] Verify all features end-to-end
- [x] Check for console errors
- [x] Test edge cases: 28/29/30/31-day months, leap years
- [x] Ensure clean, consistent code style

**Acceptance Criteria:**
- No console errors during normal usage
- All months render correctly including leap year February
- Code is readable and organized

---

## Review

### Summary of Changes
All 13 tasks completed. Three files created:

- **`index.html`** — Semantic HTML structure with calendar header (month title + prev/next buttons), day-of-week headers, grid container, and event modal with form (title, date, time, description) plus Save/Delete/Cancel buttons.

- **`style.css`** — Clean modern styling using CSS custom properties. Indigo/white color scheme. CSS Grid for the 7-column calendar layout. Modal with backdrop blur and slide-in animation. Responsive breakpoints at 768px and 480px for mobile support. Event chips styled as truncated pills.

- **`app.js`** — All application logic:
  - **State**: `currentDate` (displayed month) and `editingEventId` (modal mode)
  - **localStorage CRUD**: `getEvents()`, `saveEvents()`, `addEvent()`, `updateEvent()`, `deleteEvent()` with try/catch for corrupt data
  - **Rendering**: `renderCalendar()` builds 42-cell grid, places event chips, highlights today
  - **Navigation**: prev/next month with automatic year boundary handling
  - **Modal**: `openModal(mode, data)` / `closeModal()` handle add vs edit mode, form pre-filling, and cleanup
  - **Validation**: Title and date required, inline error messages, clear on input
  - **Event delegation**: Single click handler on grid distinguishes day cell clicks (add) from event chip clicks (edit)
  - **Close behaviors**: Cancel button, backdrop click, Escape key
