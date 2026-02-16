// ===== STATE =====
let currentDate = new Date();
currentDate.setDate(1);
let editingEventId = null;
let miniCalDate = new Date();
miniCalDate.setDate(1);

// ===== DOM REFERENCES =====
const monthTitle = document.getElementById('monthTitle');
const calendarGrid = document.getElementById('calendarGrid');
const prevBtn = document.getElementById('prevMonth');
const nextBtn = document.getElementById('nextMonth');
const todayBtn = document.getElementById('todayBtn');
const createBtn = document.getElementById('createBtn');
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
const closeModalBtn = document.getElementById('closeModalBtn');
const miniCalEl = document.getElementById('miniCal');

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

// ===== HELPERS =====
function getTodayStr() {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
}

function formatDateStr(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// ===== CALENDAR RENDERING =====
function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  monthTitle.textContent = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const todayStr = getTodayStr();
  const events = getEvents();

  calendarGrid.innerHTML = '';
  for (let i = 0; i < 42; i++) {
    const dayNum = i - firstDayOfMonth + 1;
    const cell = document.createElement('div');

    let isOutside = false;
    let isToday = false;
    let displayNum;
    let dateStr;

    if (dayNum < 1) {
      isOutside = true;
      displayNum = prevMonthDays + dayNum;
      const pm = month === 0 ? 11 : month - 1;
      const py = month === 0 ? year - 1 : year;
      dateStr = formatDateStr(py, pm, displayNum);
    } else if (dayNum > daysInMonth) {
      isOutside = true;
      displayNum = dayNum - daysInMonth;
      const nm = month === 11 ? 0 : month + 1;
      const ny = month === 11 ? year + 1 : year;
      dateStr = formatDateStr(ny, nm, displayNum);
    } else {
      displayNum = dayNum;
      dateStr = formatDateStr(year, month, dayNum);
      if (dateStr === todayStr) isToday = true;
    }

    // Build cell classes
    let cellClasses = 'day-cell border-b border-gcal-border-light px-1 py-1 min-h-0 overflow-hidden transition-colors duration-150';
    if (i % 7 !== 6) cellClasses += ' border-r';
    if (isOutside) {
      cellClasses += ' outside cursor-default';
    } else {
      cellClasses += ' cursor-pointer hover:bg-gcal-hover';
    }
    cell.className = cellClasses;

    // Day number
    const numEl = document.createElement('div');
    let numClasses = 'flex items-center justify-center w-[26px] h-[26px] text-xs font-medium rounded-full mx-auto mb-0.5 max-md:w-[22px] max-md:h-[22px] max-md:text-[0.7rem] max-sm:w-5 max-sm:h-5 max-sm:text-[0.65rem]';
    if (isToday) {
      numClasses += ' bg-gcal-blue text-white font-semibold';
    } else if (isOutside) {
      numClasses += ' text-gcal-text-light';
    } else {
      numClasses += ' text-gcal-text';
    }
    numEl.className = numClasses;
    numEl.textContent = displayNum;
    cell.appendChild(numEl);

    // Event chips
    const dayEvents = events.filter(e => e.date === dateStr);
    dayEvents.forEach(evt => {
      const chip = document.createElement('div');
      chip.className = 'event-chip bg-gcal-blue text-white text-[0.6875rem] font-medium px-1.5 py-px rounded mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer leading-snug transition-opacity duration-150 hover:opacity-85 max-md:text-[0.6rem] max-md:px-1 max-md:py-0';
      chip.textContent = evt.time ? `${evt.time} ${evt.title}` : evt.title;
      chip.dataset.eventId = evt.id;
      cell.appendChild(chip);
    });

    cell.dataset.date = dateStr;
    calendarGrid.appendChild(cell);
  }
}

// ===== MINI CALENDAR =====
function renderMiniCal() {
  const year = miniCalDate.getFullYear();
  const month = miniCalDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();
  const todayStr = getTodayStr();

  const monthName = miniCalDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  let html = `
    <div class="flex items-center justify-between mb-2 px-1">
      <span class="text-[0.8rem] font-medium text-gcal-text cursor-default">${monthName}</span>
      <div class="flex">
        <button class="mini-cal-btn bg-transparent border-none cursor-pointer w-6 h-6 rounded-full flex items-center justify-center text-gcal-text-secondary transition-colors duration-150 hover:bg-gcal-hover" data-dir="-1" aria-label="Previous">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7L9 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        </button>
        <button class="mini-cal-btn bg-transparent border-none cursor-pointer w-6 h-6 rounded-full flex items-center justify-center text-gcal-text-secondary transition-colors duration-150 hover:bg-gcal-hover" data-dir="1" aria-label="Next">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3L9 7L5 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        </button>
      </div>
    </div>
    <div class="grid grid-cols-7 text-center">
      <div class="text-[0.65rem] font-medium text-gcal-text-light py-0.5">S</div>
      <div class="text-[0.65rem] font-medium text-gcal-text-light py-0.5">M</div>
      <div class="text-[0.65rem] font-medium text-gcal-text-light py-0.5">T</div>
      <div class="text-[0.65rem] font-medium text-gcal-text-light py-0.5">W</div>
      <div class="text-[0.65rem] font-medium text-gcal-text-light py-0.5">T</div>
      <div class="text-[0.65rem] font-medium text-gcal-text-light py-0.5">F</div>
      <div class="text-[0.65rem] font-medium text-gcal-text-light py-0.5">S</div>
  `;

  for (let i = 0; i < 42; i++) {
    const dayNum = i - firstDay + 1;
    let cls = 'w-[26px] h-[26px] flex items-center justify-center rounded-full text-[0.7rem] mx-auto transition-colors duration-150';
    let display;
    let dateStr = '';

    if (dayNum < 1) {
      display = prevDays + dayNum;
      cls += ' text-gcal-text-light cursor-default';
    } else if (dayNum > daysInMonth) {
      display = dayNum - daysInMonth;
      cls += ' text-gcal-text-light cursor-default';
    } else {
      display = dayNum;
      dateStr = formatDateStr(year, month, dayNum);
      if (dateStr === todayStr) {
        cls += ' bg-gcal-blue text-white font-semibold cursor-pointer mc-day';
      } else {
        cls += ' text-gcal-text cursor-pointer hover:bg-gcal-hover mc-day';
      }
    }

    html += `<div class="${cls}" data-date="${dateStr}">${display}</div>`;
  }

  html += '</div>';
  miniCalEl.innerHTML = html;

  // Mini cal navigation
  miniCalEl.querySelectorAll('.mini-cal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const dir = parseInt(btn.dataset.dir);
      miniCalDate.setMonth(miniCalDate.getMonth() + dir);
      renderMiniCal();
    });
  });

  // Click on mini cal day to navigate main calendar
  miniCalEl.querySelectorAll('.mc-day').forEach(day => {
    day.addEventListener('click', () => {
      const dateStr = day.dataset.date;
      if (dateStr) {
        const [y, m] = dateStr.split('-').map(Number);
        currentDate = new Date(y, m - 1, 1);
        renderCalendar();
      }
    });
  });
}

// ===== MONTH NAVIGATION =====
prevBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  miniCalDate = new Date(currentDate);
  renderCalendar();
  renderMiniCal();
});

nextBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  miniCalDate = new Date(currentDate);
  renderCalendar();
  renderMiniCal();
});

todayBtn.addEventListener('click', () => {
  currentDate = new Date();
  currentDate.setDate(1);
  miniCalDate = new Date(currentDate);
  renderCalendar();
  renderMiniCal();
});

// ===== CREATE BUTTON =====
createBtn.addEventListener('click', () => {
  const todayStr = getTodayStr();
  openModal('add', { date: todayStr });
});

// ===== MODAL CONTROLS =====
function openModal(mode, data = {}) {
  editingEventId = mode === 'edit' ? data.id : null;
  modalTitle.textContent = mode === 'edit' ? 'Edit Event' : 'New Event';

  if (mode === 'edit') {
    deleteBtn.classList.remove('hidden');
    deleteBtn.classList.add('inline-flex');
  } else {
    deleteBtn.classList.remove('inline-flex');
    deleteBtn.classList.add('hidden');
  }

  eventTitle.value = data.title || '';
  eventDate.value = data.date || '';
  eventTime.value = data.time || '';
  eventDesc.value = data.description || '';

  clearErrors();
  modalOverlay.classList.remove('hidden');
  modalOverlay.classList.add('flex');
  eventTitle.focus();
}

function closeModal() {
  modalOverlay.classList.remove('flex');
  modalOverlay.classList.add('hidden');
  editingEventId = null;
  eventForm.reset();
  clearErrors();
}

function clearErrors() {
  titleError.textContent = '';
  dateError.textContent = '';
  eventTitle.classList.remove('border-b-gcal-red');
  eventTitle.classList.add('border-b-gcal-border');
  eventDate.classList.remove('border-gcal-red');
  eventDate.classList.add('border-gcal-border');
}

// ===== GRID CLICK HANDLER =====
calendarGrid.addEventListener('click', (e) => {
  const chip = e.target.closest('.event-chip');
  if (chip) {
    const eventId = chip.dataset.eventId;
    const events = getEvents();
    const evt = events.find(ev => ev.id === eventId);
    if (evt) openModal('edit', evt);
    return;
  }

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

  let valid = true;
  if (!title) {
    titleError.textContent = 'Title is required';
    eventTitle.classList.remove('border-b-gcal-border');
    eventTitle.classList.add('border-b-gcal-red');
    valid = false;
  }
  if (!date) {
    dateError.textContent = 'Date is required';
    eventDate.classList.remove('border-gcal-border');
    eventDate.classList.add('border-gcal-red');
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
closeModalBtn.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modalOverlay.classList.contains('hidden')) {
    closeModal();
  }
});

// ===== CLEAR ERRORS ON INPUT =====
eventTitle.addEventListener('input', () => {
  titleError.textContent = '';
  eventTitle.classList.remove('border-b-gcal-red');
  eventTitle.classList.add('border-b-gcal-border');
});
eventDate.addEventListener('input', () => {
  dateError.textContent = '';
  eventDate.classList.remove('border-gcal-red');
  eventDate.classList.add('border-gcal-border');
});

// ===== INIT =====
renderCalendar();
renderMiniCal();
