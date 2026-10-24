/**
 * ui.js
 * DevBoard - User Interface & DOM Rendering Module
 * 
 * Handles DOM updates, accessible dialogs, toast notifications,
 * and safe content rendering (no innerHTML for user inputs).
 */

import { t, getLocale } from './i18n.js';

/**
 * References to frequently used DOM elements.
 */
export const elements = {
  // Stats
  statTotal: document.getElementById('stat-total'),
  statPending: document.getElementById('stat-pending'),
  statCompleted: document.getElementById('stat-completed'),
  progressBar: document.getElementById('completion-progress-bar'),
  progressPercent: document.getElementById('completion-percent-text'),

  // Filters & Search
  filterButtons: document.querySelectorAll('.filter-btn'),
  searchInput: document.getElementById('search-input'),
  clearSearchBtn: document.getElementById('clear-search-btn'),
  activeFilterBadges: {
    all: document.getElementById('badge-all'),
    pending: document.getElementById('badge-pending'),
    completed: document.getElementById('badge-completed')
  },

  // Task creation
  taskForm: document.getElementById('new-task-form'),
  taskTitleInput: document.getElementById('task-title-input'),
  taskDescInput: document.getElementById('task-desc-input'),
  taskLabelSelect: document.getElementById('task-label-select'),
  titleErrorText: document.getElementById('title-error-text'),

  // Task list container
  taskListContainer: document.getElementById('task-list'),
  listStatusAnnouncement: document.getElementById('list-status-announcement'),

  // Modals
  editModal: document.getElementById('edit-modal'),
  editForm: document.getElementById('edit-task-form'),
  editTaskIdInput: document.getElementById('edit-task-id'),
  editTitleInput: document.getElementById('edit-title-input'),
  editDescInput: document.getElementById('edit-desc-input'),
  editLabelSelect: document.getElementById('edit-label-select'),
  editTitleError: document.getElementById('edit-title-error'),
  closeEditModalBtn: document.getElementById('close-edit-modal'),
  cancelEditBtn: document.getElementById('cancel-edit-btn'),

  deleteModal: document.getElementById('delete-modal'),
  deleteTaskTitleText: document.getElementById('delete-task-title-preview'),
  confirmDeleteBtn: document.getElementById('confirm-delete-btn'),
  cancelDeleteBtn: document.getElementById('cancel-delete-btn'),
  closeDeleteModalBtn: document.getElementById('close-delete-modal'),

  workshopModal: document.getElementById('workshop-modal'),
  openWorkshopBtn: document.getElementById('open-workshop-btn'),
  closeWorkshopModalBtn: document.getElementById('close-workshop-modal'),

  shortcutsModal: document.getElementById('shortcuts-modal'),
  openShortcutsBtn: document.getElementById('open-shortcuts-btn'),
  closeShortcutsModalBtn: document.getElementById('close-shortcuts-modal'),

  // Toasts
  toastContainer: document.getElementById('toast-container'),

  // Fast reset sample tasks
  resetSampleBtn: document.getElementById('reset-samples-btn')
};

// Track previously focused element for accessible modal closing
let previouslyFocusedElement = null;

/**
 * Displays a toast notification.
 * @param {string} message 
 * @param {'success' | 'error' | 'info' | 'warning'} type 
 * @param {number} duration 
 */
export function showToast(message, type = 'info', duration = 3500) {
  if (!elements.toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'status');

  const iconSvg = getToastIconSvg(type);

  const iconWrapper = document.createElement('span');
  iconWrapper.className = 'toast-icon';
  iconWrapper.innerHTML = iconSvg; // Pre-curated safe static SVGs only

  const textSpan = document.createElement('span');
  textSpan.className = 'toast-message';
  textSpan.textContent = message;

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'toast-close-btn';
  closeBtn.setAttribute('aria-label', t('toast.dismiss'));
  closeBtn.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  `;

  toast.appendChild(iconWrapper);
  toast.appendChild(textSpan);
  toast.appendChild(closeBtn);

  elements.toastContainer.appendChild(toast);

  let dismissTimeout = setTimeout(dismiss, duration);

  function dismiss() {
    clearTimeout(dismissTimeout);
    toast.classList.add('toast-dismissing');
    toast.addEventListener('transitionend', () => {
      toast.remove();
    }, { once: true });
  }

  closeBtn.addEventListener('click', dismiss);
}

/**
 * Returns static, curated SVGs for toast types.
 * @param {string} type 
 * @returns {string}
 */
function getToastIconSvg(type) {
  switch (type) {
    case 'success':
      return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    case 'error':
      return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    case 'warning':
      return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
    default:
      return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  }
}

/**
 * Updates stats dashboard elements.
 * @param {{ total: number, pending: number, completed: number, completionPercentage: number }} stats 
 */
export function renderStats(stats) {
  if (elements.statTotal) elements.statTotal.textContent = String(stats.total);
  if (elements.statPending) elements.statPending.textContent = String(stats.pending);
  if (elements.statCompleted) elements.statCompleted.textContent = String(stats.completed);

  if (elements.activeFilterBadges.all) elements.activeFilterBadges.all.textContent = String(stats.total);
  if (elements.activeFilterBadges.pending) elements.activeFilterBadges.pending.textContent = String(stats.pending);
  if (elements.activeFilterBadges.completed) elements.activeFilterBadges.completed.textContent = String(stats.completed);

  if (elements.progressBar) {
    elements.progressBar.style.width = `${stats.completionPercentage}%`;
    elements.progressBar.setAttribute('aria-valuenow', String(stats.completionPercentage));
  }

  if (elements.progressPercent) {
    elements.progressPercent.textContent = t('stats.percent', {
      percent: stats.completionPercentage
    });
  }
}

/**
 * Formats ISO timestamp into readable format.
 * @param {string} isoString 
 * @returns {string}
 */
export function formatTimestamp(isoString) {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return t('time.recently');

    return new Intl.DateTimeFormat(getLocale(), {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch {
    return t('time.recently');
  }
}

/**
 * Creates a single task card DOM element safely without innerHTML for user inputs.
 * @param {Object} task 
 * @returns {HTMLElement}
 */
export function createTaskCard(task) {
  const card = document.createElement('article');
  card.className = `task-card ${task.completed ? 'task-completed' : ''}`;
  card.dataset.taskId = task.id;
  card.setAttribute('aria-label', t('aria.taskLabel', { title: task.title }));

  // Header row: Checkbox, Title, Badges
  const topRow = document.createElement('div');
  topRow.className = 'task-card-header';

  // Toggle container
  const checkLabel = document.createElement('label');
  checkLabel.className = 'task-check-wrapper';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-checkbox';
  checkbox.checked = Boolean(task.completed);
  checkbox.setAttribute('aria-label', t(task.completed ? 'aria.markPending' : 'aria.markCompleted', { title: task.title }));
  checkbox.dataset.action = 'toggle';
  checkbox.dataset.taskId = task.id;

  const customCheck = document.createElement('span');
  customCheck.className = 'task-custom-checkbox';

  checkLabel.appendChild(checkbox);
  checkLabel.appendChild(customCheck);

  // Content column
  const contentCol = document.createElement('div');
  contentCol.className = 'task-content-column';

  const titleEl = document.createElement('h3');
  titleEl.className = 'task-title';
  titleEl.textContent = task.title; // Safe text insertion prevents XSS

  contentCol.appendChild(titleEl);

  // Optional description
  if (task.description && task.description.trim().length > 0) {
    const descEl = document.createElement('p');
    descEl.className = 'task-desc';
    descEl.textContent = task.description; // Safe text insertion
    contentCol.appendChild(descEl);
  }

  // Meta row: Label tag + Timestamp + Status badge
  const metaRow = document.createElement('div');
  metaRow.className = 'task-meta-row';

  // Label tag
  const labelBadge = document.createElement('span');
  labelBadge.className = `task-tag tag-${task.label || 'task'}`;
  const labelValue = task.label || 'task';
  const labelKey = `label.${labelValue}`;
  const translatedLabel = t(labelKey);
  labelBadge.textContent = translatedLabel === labelKey ? labelValue : translatedLabel;
  metaRow.appendChild(labelBadge);

  // Timestamp
  const timeSpan = document.createElement('span');
  timeSpan.className = 'task-date';
  timeSpan.textContent = t('task.createdAt', { time: formatTimestamp(task.createdAt) });
  metaRow.appendChild(timeSpan);

  contentCol.appendChild(metaRow);

  // Action buttons
  const actionGroup = document.createElement('div');
  actionGroup.className = 'task-actions';

  // Edit button
  const editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.className = 'btn-icon btn-edit';
  editBtn.dataset.action = 'edit';
  editBtn.dataset.taskId = task.id;
  editBtn.setAttribute('aria-label', t('aria.editTask', { title: task.title }));
  editBtn.title = t('task.edit');
  editBtn.innerHTML = `
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
    <span class="btn-text">${t('task.edit')}</span>
  `;

  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'btn-icon btn-delete';
  deleteBtn.dataset.action = 'delete';
  deleteBtn.dataset.taskId = task.id;
  deleteBtn.setAttribute('aria-label', t('aria.deleteTask', { title: task.title }));
  deleteBtn.title = t('task.delete');
  deleteBtn.innerHTML = `
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
    <span class="btn-text">${t('task.delete')}</span>
  `;

  actionGroup.appendChild(editBtn);
  actionGroup.appendChild(deleteBtn);

  topRow.appendChild(checkLabel);
  topRow.appendChild(contentCol);
  topRow.appendChild(actionGroup);

  card.appendChild(topRow);
  return card;
}

/**
 * Renders the full task list or appropriate empty states.
 * @param {Array<Object>} displayTasks Filtered tasks to display
 * @param {number} totalTaskCount Total tasks in storage
 * @param {string} currentFilter Active filter mode
 * @param {string} searchQuery Active search text
 * @param {{ onResetSamples?: () => void, onClearFilters?: () => void }} actions Callbacks
 */
export function renderTaskList(displayTasks, totalTaskCount, currentFilter, searchQuery, actions = {}) {
  const container = elements.taskListContainer;
  if (!container) return;

  container.innerHTML = '';

  // Case 1: Total tasks is 0 (Absolute empty state)
  if (totalTaskCount === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = `
      <div class="empty-icon-box">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
      </div>
      <h3 class="empty-title">${t('empty.noTasksTitle')}</h3>
      <p class="empty-desc">${t('empty.noTasksDesc')}</p>
      <div class="empty-actions">
        <button type="button" id="empty-load-samples-btn" class="btn btn-secondary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
          </svg>
          ${t('empty.loadSamples')}
        </button>
      </div>
    `;

    container.appendChild(emptyState);

    const loadBtn = emptyState.querySelector('#empty-load-samples-btn');
    if (loadBtn && actions.onResetSamples) {
      loadBtn.addEventListener('click', actions.onResetSamples);
    }

    if (elements.listStatusAnnouncement) {
      elements.listStatusAnnouncement.textContent = t('aria.noTasks');
    }
    return;
  }

  // Case 2: Tasks exist, but current search / filter returned 0 results
  if (displayTasks.length === 0) {
    const filterEmptyState = document.createElement('div');
    filterEmptyState.className = 'empty-state';

    const query = searchQuery.trim();
    const hasQuery = query.length > 0;
    const hasStatus = currentFilter !== 'all';

    let noMatchDesc;
    if (hasQuery && hasStatus) {
      noMatchDesc = t('empty.noMatchBoth', {
        status: t(`filter.${currentFilter}`),
        query
      });
    } else if (hasStatus) {
      noMatchDesc = t('empty.noMatchStatus', { status: t(`filter.${currentFilter}`) });
    } else {
      noMatchDesc = t('empty.noMatchQuery', { query });
    }

    filterEmptyState.innerHTML = `
      <div class="empty-icon-box">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
      </div>
      <h3 class="empty-title">${t('empty.noMatchTitle')}</h3>
      <p class="empty-desc"></p>
      <div class="empty-actions">
        <button type="button" id="clear-all-filters-btn" class="btn btn-secondary">
          ${t('empty.clearFilters')}
        </button>
      </div>
    `;

    // Set the description via textContent so a user-supplied query is never parsed as HTML.
    const descEl = filterEmptyState.querySelector('.empty-desc');
    if (descEl) descEl.textContent = noMatchDesc;

    container.appendChild(filterEmptyState);

    const clearBtn = filterEmptyState.querySelector('#clear-all-filters-btn');
    if (clearBtn && actions.onClearFilters) {
      clearBtn.addEventListener('click', actions.onClearFilters);
    }

    if (elements.listStatusAnnouncement) {
      elements.listStatusAnnouncement.textContent = t('aria.noMatch');
    }
    return;
  }

  // Case 3: Render list of tasks
  const fragment = document.createDocumentFragment();
  displayTasks.forEach(task => {
    const card = createTaskCard(task);
    fragment.appendChild(card);
  });
  container.appendChild(fragment);

  if (elements.listStatusAnnouncement) {
    elements.listStatusAnnouncement.textContent = t('aria.statusShowing', { count: displayTasks.length });
  }
}

/**
 * Opens an accessible modal dialog.
 * @param {HTMLElement} modal 
 */
export function openModal(modal) {
  if (!modal) return;
  previouslyFocusedElement = document.activeElement;

  modal.classList.add('modal-active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-is-open');

  // Focus the first focusable element inside the modal
  const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusable.length > 0) {
    /** @type {HTMLElement} */ (focusable[0]).focus();
  }
}

/**
 * Closes an accessible modal dialog.
 * @param {HTMLElement} modal 
 */
export function closeModal(modal) {
  if (!modal) return;

  modal.classList.remove('modal-active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-is-open');

  if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
    previouslyFocusedElement.focus();
  }
}

/**
 * Pre-populates and opens the Edit Modal.
 * @param {Object} task 
 */
export function openEditModal(task) {
  if (!elements.editModal || !task) return;

  elements.editTaskIdInput.value = task.id;
  elements.editTitleInput.value = task.title;
  elements.editDescInput.value = task.description || '';
  elements.editLabelSelect.value = task.label || 'task';
  elements.editTitleError.textContent = '';
  elements.editTitleInput.classList.remove('input-invalid');

  openModal(elements.editModal);
}

/**
 * Pre-populates and opens the Delete Confirmation Modal.
 * @param {Object} task 
 */
export function openDeleteModal(task) {
  if (!elements.deleteModal || !task) return;

  elements.deleteTaskTitleText.textContent = `"${task.title}"`;
  elements.confirmDeleteBtn.dataset.taskId = task.id;

  openModal(elements.deleteModal);
}

/**
 * Displays an inline validation error on an input element.
 * @param {HTMLInputElement} inputEl 
 * @param {HTMLElement} errorEl 
 * @param {string} errorMessage 
 */
export function showInputError(inputEl, errorEl, errorMessage) {
  if (inputEl) {
    inputEl.classList.add('input-invalid');
    inputEl.setAttribute('aria-invalid', 'true');
  }
  if (errorEl) {
    errorEl.textContent = errorMessage;
    errorEl.classList.add('visible');
  }
}

/**
 * Clears an inline validation error on an input element.
 * @param {HTMLInputElement} inputEl 
 * @param {HTMLElement} errorEl 
 */
export function clearInputError(inputEl, errorEl) {
  if (inputEl) {
    inputEl.classList.remove('input-invalid');
    inputEl.removeAttribute('aria-invalid');
  }
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
  }
}
