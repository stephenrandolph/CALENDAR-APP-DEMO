// ===== STATE =====
let currentDate = new Date();
currentDate.setDate(1); // Always the 1st of the displayed month
let editingEventId = null;

// ===== DOM REFERENCES =====
const monthTitle = document.getElementById('monthTitle');
const calendarGrid = document.getElementById('calendarGrid');
const prevBtn = document.getElementById('prevMonth');
const nextBtn = document.getElementById('nextMonth');
const modalOverlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const eventForm = document.getElementById('eventForm');
const eventTitle = document.getElementById('eventTitle');
const eventDate = document.getElementById('eventDate');
const eventTime = document.getElementById('eventTime');
const eventDesc = document.getElementById('eventDesc');
const titleError = document.getElementById('titleError');
const dateError = document.getElementById('dateError');
const deleteBtn = document.getElementById('deleteBtn');
const cancelBtn = document.getElementById('cancelBtn');

// ===== LOCAL STORAGE CRUD =====
const STORAGE_KEY = 'calendarEvents';

function getEvents() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveEvents(events) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch {
    // localStorage full or unavailable
  }
}

function addEvent(data) {
  const events = getEvents();
  events.push({ id: crypto.randomUUID(), ...data });
  saveEvents(events);
}

function updateEvent(id, data) {
  const events = getEvents();
  const idx = events.findIndex(e => e.id === id);
  if (idx !== -1) {
    events[idx] = { ...events[idx], ...data };
    saveEvents(events);
  }
}

function deleteEvent(id) {
  const events = getEvents().filter(e => e.id !== id);
  saveEvents(events);
}

// ===== CALENDAR RENDERING =====
function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Update header
  monthTitle.textContent = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Calculate grid
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Today reference
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // Get events for this month
  const events = getEvents();

  // Build 42 cells (6 rows)
  calendarGrid.innerHTML = '';
  for (let i = 0; i < 42; i++) {
    const dayNum = i - firstDayOfMonth + 1;
    const cell = document.createElement('div');
    cell.className = 'day-cell';

    if (dayNum < 1 || dayNum > daysInMonth) {
      cell.classList.add('outside');
      calendarGrid.appendChild(cell);
      continue;
    }

    // Date string for this cell
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;

    // Today highlight
    if (dateStr === todayStr) {
      cell.classList.add('today');
    }

    // Day number
    const numEl = document.createElement('div');
    numEl.className = 'day-number';
    numEl.textContent = dayNum;
    cell.appendChild(numEl);

    // Event chips for this day
    const dayEvents = events.filter(e => e.date === dateStr);
    dayEvents.forEach(evt => {
      const chip = document.createElement('div');
      chip.className = 'event-chip';
      chip.textContent = evt.time ? `${evt.time} ${evt.title}` : evt.title;
      chip.dataset.eventId = evt.id;
      cell.appendChild(chip);
    });

    // Store date on cell for add-event click
    cell.dataset.date = dateStr;
    calendarGrid.appendChild(cell);
  }
}

// ===== MONTH NAVIGATION =====
prevBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

// ===== MODAL CONTROLS =====
function openModal(mode, data = {}) {
  editingEventId = mode === 'edit' ? data.id : null;
  modalTitle.textContent = mode === 'edit' ? 'Edit Event' : 'Add Event';
  deleteBtn.classList.toggle('visible', mode === 'edit');

  // Fill form
  eventTitle.value = data.title || '';
  eventDate.value = data.date || '';
  eventTime.value = data.time || '';
  eventDesc.value = data.description || '';

  // Clear errors
  clearErrors();

  modalOverlay.classList.add('open');
  eventTitle.focus();
}

function closeModal() {
  modalOverlay.classList.remove('open');
  editingEventId = null;
  eventForm.reset();
  clearErrors();
}

function clearErrors() {
  titleError.textContent = '';
  dateError.textContent = '';
  eventTitle.classList.remove('error');
  eventDate.classList.remove('error');
}

// ===== GRID CLICK HANDLER (event delegation) =====
calendarGrid.addEventListener('click', (e) => {
  // Check if an event chip was clicked
  const chip = e.target.closest('.event-chip');
  if (chip) {
    const eventId = chip.dataset.eventId;
    const events = getEvents();
    const evt = events.find(ev => ev.id === eventId);
    if (evt) {
      openModal('edit', evt);
    }
    return;
  }

  // Check if a day cell was clicked (not outside)
  const cell = e.target.closest('.day-cell');
  if (cell && !cell.classList.contains('outside')) {
    openModal('add', { date: cell.dataset.date });
  }
});

// ===== FORM SUBMISSION =====
eventForm.addEventListener('submit', (e) => {
  e.preventDefault();
  clearErrors();

  const title = eventTitle.value.trim();
  const date = eventDate.value;
  const time = eventTime.value;
  const description = eventDesc.value.trim();

  // Validation
  let valid = true;
  if (!title) {
    titleError.textContent = 'Title is required';
    eventTitle.classList.add('error');
    valid = false;
  }
  if (!date) {
    dateError.textContent = 'Date is required';
    eventDate.classList.add('error');
    valid = false;
  }
  if (!valid) return;

  const data = { title, date, time, description };

  if (editingEventId) {
    updateEvent(editingEventId, data);
  } else {
    addEvent(data);
  }

  closeModal();
  renderCalendar();
});

// ===== DELETE =====
deleteBtn.addEventListener('click', () => {
  if (editingEventId) {
    deleteEvent(editingEventId);
    closeModal();
    renderCalendar();
  }
});

// ===== MODAL CLOSE BEHAVIORS =====
cancelBtn.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
    closeModal();
  }
});

// ===== CLEAR ERRORS ON INPUT =====
eventTitle.addEventListener('input', () => {
  titleError.textContent = '';
  eventTitle.classList.remove('error');
});
eventDate.addEventListener('input', () => {
  dateError.textContent = '';
  eventDate.classList.remove('error');
});

// ===== INIT =====
renderCalendar();
