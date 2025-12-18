/**
 * MiniCalendar Client-Side Logic
 * Handles calendar rendering, navigation, and tooltip interactions
 */

import {
  MONTH_NAMES,
  formatDateKeyFromParts,
  getDaysInMonth,
  getFirstDayOfMonth,
  getTodayKey,
  type CalendarEvent,
  type EventsByDate,
} from '../utils/calendarUtils';

// ============================================================================
// Types
// ============================================================================

interface CalendarElements {
  container: Element;
  daysContainer: Element | null;
  monthYearLabel: Element | null;
  prevBtn: Element | null;
  nextBtn: Element | null;
  todayBtn: Element | null;
  tooltip: HTMLElement | null;
  tooltipContent: Element | null;
}

// ============================================================================
// Initialization
// ============================================================================

/**
 * Initialize all mini calendars on the page
 */
export function initMiniCalendars(): void {
  const calendars = document.querySelectorAll('.mini-calendar');
  calendars.forEach(initCalendar);
}

/**
 * Initialize a single calendar instance
 */
function initCalendar(container: Element): void {
  const eventsByDate: EventsByDate = JSON.parse(
    container.getAttribute('data-events') || '{}'
  );

  const elements: CalendarElements = {
    container,
    daysContainer: container.querySelector('.cal-days'),
    monthYearLabel: container.querySelector('.cal-month-year'),
    prevBtn: container.querySelector('.cal-prev'),
    nextBtn: container.querySelector('.cal-next'),
    todayBtn: container.querySelector('.cal-today'),
    tooltip: container.querySelector('.cal-tooltip') as HTMLElement,
    tooltipContent: container.querySelector('.cal-tooltip-content'),
  };

  let currentDate = new Date();

  // Bind event handlers
  elements.prevBtn?.addEventListener('click', () => {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    hideTooltip(elements);
    renderCalendar(elements, eventsByDate, currentDate);
  });

  elements.nextBtn?.addEventListener('click', () => {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    hideTooltip(elements);
    renderCalendar(elements, eventsByDate, currentDate);
  });

  elements.todayBtn?.addEventListener('click', () => {
    currentDate = new Date();
    hideTooltip(elements);
    renderCalendar(elements, eventsByDate, currentDate);
  });

  // Hide tooltip when clicking outside
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target as Node)) {
      hideTooltip(elements);
    }
  });

  // Initial render
  renderCalendar(elements, eventsByDate, currentDate);
}

// ============================================================================
// Rendering
// ============================================================================

/**
 * Render the calendar for a given month
 */
function renderCalendar(
  elements: CalendarElements,
  eventsByDate: EventsByDate,
  currentDate: Date
): void {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Update month/year label
  if (elements.monthYearLabel) {
    elements.monthYearLabel.textContent = `${MONTH_NAMES[month]} ${year}`;
  }

  // Calculate calendar grid
  const firstDay = getFirstDayOfMonth(year, month);
  const daysInMonth = getDaysInMonth(year, month);
  const daysInPrevMonth = getDaysInMonth(year, month === 0 ? 11 : month - 1);
  const todayKey = getTodayKey();

  let html = '';

  // Previous month's trailing days
  html += renderPreviousMonthDays(year, month, firstDay, daysInPrevMonth, eventsByDate);

  // Current month's days
  html += renderCurrentMonthDays(year, month, daysInMonth, eventsByDate, todayKey);

  // Next month's leading days
  html += renderNextMonthDays(year, month, firstDay, daysInMonth, eventsByDate);

  // Update DOM
  if (elements.daysContainer) {
    elements.daysContainer.innerHTML = html;
    bindDotClickHandlers(elements, eventsByDate);
  }
}

/**
 * Render trailing days from previous month
 */
function renderPreviousMonthDays(
  year: number,
  month: number,
  firstDay: number,
  daysInPrevMonth: number,
  eventsByDate: EventsByDate
): string {
  let html = '';
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;

  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const dateKey = formatDateKeyFromParts(prevYear, prevMonth, day);
    const events = eventsByDate[dateKey] || [];

    html += renderDay(day, dateKey, events, true, false);
  }

  return html;
}

/**
 * Render current month's days
 */
function renderCurrentMonthDays(
  year: number,
  month: number,
  daysInMonth: number,
  eventsByDate: EventsByDate,
  todayKey: string
): string {
  let html = '';

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = formatDateKeyFromParts(year, month, day);
    const events = eventsByDate[dateKey] || [];
    const isToday = dateKey === todayKey;

    html += renderDay(day, dateKey, events, false, isToday);
  }

  return html;
}

/**
 * Render leading days from next month
 */
function renderNextMonthDays(
  year: number,
  month: number,
  firstDay: number,
  daysInMonth: number,
  eventsByDate: EventsByDate
): string {
  let html = '';
  const totalCells = firstDay + daysInMonth;
  const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  for (let day = 1; day <= remainingCells; day++) {
    const dateKey = formatDateKeyFromParts(nextYear, nextMonth, day);
    const events = eventsByDate[dateKey] || [];

    html += renderDay(day, dateKey, events, true, false);
  }

  return html;
}

/**
 * Render a single day cell
 */
function renderDay(
  day: number,
  dateKey: string,
  events: CalendarEvent[],
  isOtherMonth: boolean,
  isToday: boolean
): string {
  const classes = ['cal-day'];
  if (isOtherMonth) classes.push('other-month');
  if (isToday) classes.push('today');

  return `
    <div class="${classes.join(' ')}">
      <span class="cal-day-number">${day}</span>
      ${renderDots(events, dateKey)}
    </div>
  `;
}

/**
 * Render event indicator dots
 */
function renderDots(events: CalendarEvent[], dateKey: string): string {
  const count = events.length;
  if (count === 0) return '<div class="cal-dots"></div>';

  const dots = [];
  if (count >= 1) dots.push('<span class="cal-dot"></span>');
  if (count >= 2) dots.push('<span class="cal-dot dot-secondary"></span>');
  if (count >= 3) dots.push('<span class="cal-dot dot-tertiary"></span>');

  return `<div class="cal-dots" data-date="${dateKey}">${dots.join('')}</div>`;
}

// ============================================================================
// Tooltip
// ============================================================================

/**
 * Bind click handlers to event dots
 */
function bindDotClickHandlers(elements: CalendarElements, eventsByDate: EventsByDate): void {
  elements.daysContainer?.querySelectorAll('.cal-dots[data-date]').forEach(dotsEl => {
    dotsEl.addEventListener('click', (e) => {
      e.stopPropagation();
      const dateKey = dotsEl.getAttribute('data-date');
      if (dateKey && eventsByDate[dateKey]) {
        showTooltip(elements, eventsByDate[dateKey], dotsEl as HTMLElement);
      }
    });
  });
}

/**
 * Show tooltip with event details
 */
function showTooltip(
  elements: CalendarElements,
  events: CalendarEvent[],
  target: HTMLElement
): void {
  const { tooltip, tooltipContent, container } = elements;
  if (!tooltip || !tooltipContent) return;

  // Build tooltip content
  const html = events.map(event => `
    <div class="cal-tooltip-event">
      <a href="/events/${event.slug}/">${event.title}</a>
      ${event.type ? `<div class="cal-tooltip-type">${event.type}</div>` : ''}
    </div>
  `).join('');

  tooltipContent.innerHTML = html;
  tooltip.classList.remove('hidden');

  // Position tooltip
  const rect = target.getBoundingClientRect();
  const calRect = container.getBoundingClientRect();
  tooltip.style.left = `${rect.left - calRect.left - 60}px`;
  tooltip.style.top = `${rect.bottom - calRect.top + 8}px`;
}

/**
 * Hide the tooltip
 */
function hideTooltip(elements: CalendarElements): void {
  elements.tooltip?.classList.add('hidden');
}

// ============================================================================
// Auto-initialize on DOM ready
// ============================================================================

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initMiniCalendars);
}
