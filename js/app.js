/**
 * app.js
 * DevBoard - Main Application Controller
 * 
 * Orchestrates event handling, state synchronization, local storage persistence,
 * and user interactions across DevBoard.
 */

import {
  loadTasksFromStorage,
  saveTasksToStorage,
  resetStorageToDefaults
} from './storage.js';

import {
  createTask,
  updateTask,
  toggleTaskStatus,
  deleteTask,
  filterAndSearchTasks,
  getTaskStats,
  validateTaskTitle
} from './tasks.js';

import {
  elements,
  showToast,
  renderStats,
  renderTaskList,
  openModal,
  closeModal,
  openEditModal,
  openDeleteModal,
  showInputError,
  clearInputError
} from './ui.js';

import { initI18n, t } from './i18n.js';

// Application State
const state = {
  tasks: [],
  currentFilter: 'all', // 'all' | 'pending' | 'completed'
  searchQuery: '',
  taskPendingDeletion: null
};

/**
 * Initializes DevBoard on DOM ready.
 */
function init() {
  // 0. Apply the saved (or browser) language before rendering anything
  initI18n();

  // 1. Load tasks from LocalStorage
  const loadResult = loadTasksFromStorage();
  state.tasks = loadResult.tasks;

  if (loadResult.recovered) {
    showToast(t('toast.recovered'), 'warning', 4500);
  }

  // 2. Initial Render
  syncUI();

  // 3. Bind Event Listeners
  bindEvents();

  // 4. Re-render dynamic content when the language changes
  document.addEventListener('devboard:languagechange', syncUI);
}

/**
 * Re-renders the task list, statistics, and counter badges.
 */
function syncUI() {
  const stats = getTaskStats(state.tasks);
  renderStats(stats);

  const displayTasks = filterAndSearchTasks(state.tasks, {
    status: state.currentFilter,
    query: state.searchQuery
  });

  renderTaskList(
    displayTasks,
    state.tasks.length,
    state.currentFilter,
    state.searchQuery,
    {
      onResetSamples: handleResetToSamples,
      onClearFilters: handleClearFiltersAndSearch
    }
  );
}

/**
 * Persists current state tasks to LocalStorage and alerts on write failure.
 */
function persistTasks() {
  const saveResult = saveTasksToStorage(state.tasks);
  if (!saveResult.success) {
    showToast(t('toast.storageError', { error: saveResult.error }), 'error');
  }
}

/**
 * Binds all user interaction handlers.
 */
function bindEvents() {
  // --- New Task Form Submission ---
  if (elements.taskForm) {
    elements.taskForm.addEventListener('submit', handleCreateTask);
  }

  if (elements.taskTitleInput) {
    elements.taskTitleInput.addEventListener('input', () => {
      clearInputError(elements.taskTitleInput, elements.titleErrorText);
    });
  }

  // --- Filtering ---
  elements.filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filterValue = button.dataset.filter || 'all';
      setFilter(filterValue);
    });
  });

  // --- Searching ---
  if (elements.searchInput) {
    elements.searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      if (elements.clearSearchBtn) {
        elements.clearSearchBtn.style.visibility = state.searchQuery.length > 0 ? 'visible' : 'hidden';
      }
      syncUI();
    });
  }

  if (elements.clearSearchBtn) {
    elements.clearSearchBtn.addEventListener('click', () => {
      if (elements.searchInput) {
        elements.searchInput.value = '';
        state.searchQuery = '';
        elements.clearSearchBtn.style.visibility = 'hidden';
        elements.searchInput.focus();
        syncUI();
      }
    });
  }

  // --- Task List Interactions (Delegation) ---
  if (elements.taskListContainer) {
    elements.taskListContainer.addEventListener('click', handleTaskListClick);
  }

  // --- Edit Task Modal ---
  if (elements.editForm) {
    elements.editForm.addEventListener('submit', handleSaveEditedTask);
  }

  if (elements.editTitleInput) {
    elements.editTitleInput.addEventListener('input', () => {
      clearInputError(elements.editTitleInput, elements.editTitleError);
    });
  }

  if (elements.closeEditModalBtn) {
    elements.closeEditModalBtn.addEventListener('click', () => closeModal(elements.editModal));
  }

  if (elements.cancelEditBtn) {
    elements.cancelEditBtn.addEventListener('click', () => closeModal(elements.editModal));
  }

  // --- Delete Confirmation Modal ---
  if (elements.confirmDeleteBtn) {
    elements.confirmDeleteBtn.addEventListener('click', handleConfirmDelete);
  }

  if (elements.closeDeleteModalBtn) {
    elements.closeDeleteModalBtn.addEventListener('click', () => closeModal(elements.deleteModal));
  }

  if (elements.cancelDeleteBtn) {
    elements.cancelDeleteBtn.addEventListener('click', () => closeModal(elements.deleteModal));
  }

  // --- Workshop Guide Modal ---
  if (elements.openWorkshopBtn) {
    elements.openWorkshopBtn.addEventListener('click', () => openModal(elements.workshopModal));
  }

  if (elements.closeWorkshopModalBtn) {
    elements.closeWorkshopModalBtn.addEventListener('click', () => closeModal(elements.workshopModal));
  }

  // --- Keyboard Shortcuts Modal ---
  if (elements.openShortcutsBtn) {
    elements.openShortcutsBtn.addEventListener('click', () => openModal(elements.shortcutsModal));
  }

  if (elements.closeShortcutsModalBtn) {
    elements.closeShortcutsModalBtn.addEventListener('click', () => closeModal(elements.shortcutsModal));
  }

  // --- Fast Reset Sample Tasks ---
  if (elements.resetSampleBtn) {
    elements.resetSampleBtn.addEventListener('click', handleResetToSamples);
  }

  // --- Backdrop Click for Modals ---
  [elements.editModal, elements.deleteModal, elements.workshopModal, elements.shortcutsModal].forEach(modal => {
    if (!modal) return;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // --- Global Keyboard Shortcuts ---
  window.addEventListener('keydown', handleGlobalKeydown);
}

/**
 * Handles creation of a new task.
 * @param {Event} e 
 */
function handleCreateTask(e) {
  e.preventDefault();

  const title = elements.taskTitleInput.value;
  const description = elements.taskDescInput ? elements.taskDescInput.value : '';
  const label = elements.taskLabelSelect ? elements.taskLabelSelect.value : 'task';

  // Validate title before submission
  const validation = validateTaskTitle(title);
  if (!validation.isValid) {
    showInputError(elements.taskTitleInput, elements.titleErrorText, validation.error || t('error.validTitle'));
    elements.taskTitleInput.focus();
    return;
  }

  const result = createTask({ title, description, label });
  if (!result.success || !result.task) {
    showToast(result.error || t('error.createTask'), 'error');
    return;
  }

  // Prepend new task so it appears at the top
  state.tasks = [result.task, ...state.tasks];
  persistTasks();

  // Reset form inputs
  elements.taskForm.reset();
  clearInputError(elements.taskTitleInput, elements.titleErrorText);

  syncUI();
  showToast(t('toast.taskCreated', { title: result.task.title }), 'success');
}

/**
 * Handles clicks within the task list (Toggle checkbox, Edit button, Delete button).
 * @param {MouseEvent} e 
 */
function handleTaskListClick(e) {
  const target = /** @type {HTMLElement} */ (e.target);
  const actionEl = target.closest('[data-action]');
  if (!actionEl) return;

  const action = actionEl.dataset.action;
  const taskId = actionEl.dataset.taskId;
  if (!taskId) return;

  if (action === 'toggle') {
    handleToggleTask(taskId);
  } else if (action === 'edit') {
    const task = state.tasks.find(t => t.id === taskId);
    if (task) {
      openEditModal(task);
    }
  } else if (action === 'delete') {
    const task = state.tasks.find(t => t.id === taskId);
    if (task) {
      state.taskPendingDeletion = task;
      openDeleteModal(task);
    }
  }
}

/**
 * Toggles status between pending and completed.
 * @param {string} taskId 
 */
function handleToggleTask(taskId) {
  const result = toggleTaskStatus(state.tasks, taskId);
  if (!result.success || !result.toggledTask) {
    showToast(result.error || t('error.toggleTask'), 'error');
    return;
  }

  state.tasks = result.tasks;
  persistTasks();
  syncUI();

  showToast(result.toggledTask.completed ? t('toast.taskCompleted') : t('toast.taskPending'), 'info', 2500);
}

/**
 * Handles saving an edited task.
 * @param {Event} e 
 */
function handleSaveEditedTask(e) {
  e.preventDefault();

  const taskId = elements.editTaskIdInput.value;
  const title = elements.editTitleInput.value;
  const description = elements.editDescInput.value;
  const label = elements.editLabelSelect.value;

  const validation = validateTaskTitle(title);
  if (!validation.isValid) {
    showInputError(elements.editTitleInput, elements.editTitleError, validation.error || t('error.validTitle'));
    elements.editTitleInput.focus();
    return;
  }

  const result = updateTask(state.tasks, taskId, { title, description, label });
  if (!result.success || !result.updatedTask) {
    showToast(result.error || t('error.updateTask'), 'error');
    return;
  }

  state.tasks = result.tasks;
  persistTasks();
  closeModal(elements.editModal);
  syncUI();

  showToast(t('toast.taskUpdated', { title: result.updatedTask.title }), 'success');
}

/**
 * Handles confirmed deletion of a task.
 */
function handleConfirmDelete() {
  if (!state.taskPendingDeletion) {
    closeModal(elements.deleteModal);
    return;
  }

  const result = deleteTask(state.tasks, state.taskPendingDeletion.id);
  state.taskPendingDeletion = null;
  closeModal(elements.deleteModal);

  if (result.success && result.deletedTask) {
    state.tasks = result.tasks;
    persistTasks();
    syncUI();
    showToast(t('toast.taskDeleted', { title: result.deletedTask.title }), 'info');
  } else {
    showToast(t('error.deleteTask'), 'error');
  }
}

/**
 * Sets active filter and updates button states.
 * @param {'all' | 'pending' | 'completed'} filter 
 */
function setFilter(filter) {
  state.currentFilter = filter;

  elements.filterButtons.forEach(btn => {
    const isSelected = btn.dataset.filter === filter;
    btn.classList.toggle('active', isSelected);
    btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
  });

  syncUI();
}

/**
 * Resets storage and state back to default workshop demo tasks.
 */
function handleResetToSamples() {
  state.tasks = resetStorageToDefaults();
  state.currentFilter = 'all';
  state.searchQuery = '';

  if (elements.searchInput) {
    elements.searchInput.value = '';
    if (elements.clearSearchBtn) elements.clearSearchBtn.style.visibility = 'hidden';
  }

  elements.filterButtons.forEach(btn => {
    const isSelected = btn.dataset.filter === 'all';
    btn.classList.toggle('active', isSelected);
    btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
  });

  syncUI();
  showToast(t('toast.samplesRestored'), 'success');
}

/**
 * Clears search and filter back to 'all'.
 */
function handleClearFiltersAndSearch() {
  state.searchQuery = '';
  if (elements.searchInput) {
    elements.searchInput.value = '';
  }
  if (elements.clearSearchBtn) {
    elements.clearSearchBtn.style.visibility = 'hidden';
  }
  setFilter('all');
}

/**
 * Global keyboard shortcuts handler.
 * @param {KeyboardEvent} e 
 */
function handleGlobalKeydown(e) {
  // If Escape is pressed, close any open modal
  if (e.key === 'Escape') {
    const activeModal = document.querySelector('.modal.modal-active');
    if (activeModal) {
      closeModal(activeModal);
      return;
    }
  }

  // Do not fire single-key shortcuts if user is typing in form controls
  const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
  const isTyping = activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select';
  if (isTyping) return;

  // Shortcut 'N': focus new task input
  if (e.key === 'n' || e.key === 'N') {
    e.preventDefault();
    if (elements.taskTitleInput) {
      elements.taskTitleInput.focus();
      elements.taskTitleInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // Shortcut '/': focus search bar
  if (e.key === '/') {
    e.preventDefault();
    if (elements.searchInput) {
      elements.searchInput.focus();
      elements.searchInput.select();
    }
  }

  // Shortcut '?': toggle shortcuts dialog
  if (e.key === '?') {
    e.preventDefault();
    if (elements.shortcutsModal.classList.contains('modal-active')) {
      closeModal(elements.shortcutsModal);
    } else {
      openModal(elements.shortcutsModal);
    }
  }
}

// Bootstrap application on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
