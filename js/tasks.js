/**
 * tasks.js
 * DevBoard - Task Domain Logic Module
 *
 * Pure JavaScript business logic for managing tasks, validations,
 * filtering, searching, and statistics calculation.
 */

import { t } from './i18n.js';

/**
 * Validates task title input.
 * Ensures title is non-empty, contains non-whitespace characters, and doesn't exceed length limits.
 * 
 * @param {string} rawTitle 
 * @returns {{ isValid: boolean, error: string | null, value: string }}
 */
export function validateTaskTitle(rawTitle) {
  if (typeof rawTitle !== 'string') {
    return { isValid: false, error: t('validation.text'), value: '' };
  }

  const trimmed = rawTitle.trim();

  if (trimmed.length === 0) {
    return { isValid: false, error: t('validation.empty'), value: '' };
  }

  if (trimmed.length > 150) {
    return { isValid: false, error: t('validation.tooLong'), value: trimmed };
  }

  return { isValid: true, error: null, value: trimmed };
}

/**
 * Generates a unique task identifier.
 * Uses standard crypto.randomUUID if available, with a timestamp fallback.
 * 
 * @returns {string}
 */
export function generateTaskId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `task-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `task-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
}

/**
 * Creates a new task object.
 * 
 * @param {{ title: string, description?: string, label?: string }} data 
 * @returns {{ success: boolean, task: Object | null, error: string | null }}
 */
export function createTask({ title, description = '', label = 'task' }) {
  const validation = validateTaskTitle(title);
  if (!validation.isValid) {
    return { success: false, task: null, error: validation.error };
  }

  const validLabels = ['task', 'feature', 'bug', 'enhancement', 'documentation'];
  const sanitizedLabel = validLabels.includes(label) ? label : 'task';

  const task = {
    id: generateTaskId(),
    title: validation.value,
    description: typeof description === 'string' ? description.trim() : '',
    label: sanitizedLabel,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: null
  };

  return { success: true, task, error: null };
}

/**
 * Updates an existing task with new field values.
 * 
 * @param {Array<Object>} tasks 
 * @param {string} taskId 
 * @param {{ title?: string, description?: string, label?: string }} updates 
 * @returns {{ success: boolean, tasks: Array<Object>, updatedTask: Object | null, error: string | null }}
 */
export function updateTask(tasks, taskId, updates) {
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) {
    return { success: false, tasks, updatedTask: null, error: t('error.taskNotFound') };
  }

  const existingTask = tasks[taskIndex];
  let updatedTitle = existingTask.title;

  if (updates.title !== undefined) {
    const validation = validateTaskTitle(updates.title);
    if (!validation.isValid) {
      return { success: false, tasks, updatedTask: null, error: validation.error };
    }
    updatedTitle = validation.value;
  }

  const validLabels = ['task', 'feature', 'bug', 'enhancement', 'documentation'];
  const updatedLabel = updates.label && validLabels.includes(updates.label) 
    ? updates.label 
    : existingTask.label || 'task';

  const updatedDescription = updates.description !== undefined
    ? (typeof updates.description === 'string' ? updates.description.trim() : '')
    : existingTask.description;

  const updatedTask = {
    ...existingTask,
    title: updatedTitle,
    description: updatedDescription,
    label: updatedLabel,
    updatedAt: new Date().toISOString()
  };

  const newTasks = [...tasks];
  newTasks[taskIndex] = updatedTask;

  return { success: true, tasks: newTasks, updatedTask, error: null };
}

/**
 * Toggles a task's completion status.
 * 
 * @param {Array<Object>} tasks 
 * @param {string} taskId 
 * @returns {{ success: boolean, tasks: Array<Object>, toggledTask: Object | null, error: string | null }}
 */
export function toggleTaskStatus(tasks, taskId) {
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) {
    return { success: false, tasks, toggledTask: null, error: t('error.taskNotFound') };
  }

  const targetTask = tasks[taskIndex];
  const toggledTask = {
    ...targetTask,
    completed: !targetTask.completed,
    updatedAt: new Date().toISOString()
  };

  const newTasks = [...tasks];
  newTasks[taskIndex] = toggledTask;

  return { success: true, tasks: newTasks, toggledTask, error: null };
}

/**
 * Deletes a task by ID.
 * 
 * @param {Array<Object>} tasks 
 * @param {string} taskId 
 * @returns {{ success: boolean, tasks: Array<Object>, deletedTask: Object | null }}
 */
export function deleteTask(tasks, taskId) {
  const taskToDelete = tasks.find(t => t.id === taskId) || null;
  if (!taskToDelete) {
    return { success: false, tasks, deletedTask: null };
  }

  const newTasks = tasks.filter(t => t.id !== taskId);
  return { success: true, tasks: newTasks, deletedTask: taskToDelete };
}

/**
 * Filters and searches tasks based on status and search query.
 * 
 * @param {Array<Object>} tasks 
 * @param {{ status?: 'all' | 'pending' | 'completed', query?: string }} options 
 * @returns {Array<Object>}
 */
export function filterAndSearchTasks(tasks, { status = 'all', query = '' } = {}) {
  const normalizedQuery = (typeof query === 'string' ? query.trim().toLowerCase() : '');

  return tasks.filter(task => {
    // 1. Status Filter
    if (status === 'pending' && task.completed) return false;
    if (status === 'completed' && !task.completed) return false;

    // 2. Search Query (Matches title or description or label)
    if (normalizedQuery.length > 0) {
      const matchTitle = task.title.toLowerCase().includes(normalizedQuery);
      const matchDescription = (task.description || '').toLowerCase().includes(normalizedQuery);
      const matchLabel = (task.label || '').toLowerCase().includes(normalizedQuery);
      return matchTitle || matchDescription || matchLabel;
    }

    return true;
  });
}

/**
 * Calculates metrics across the entire task set.
 * 
 * @param {Array<Object>} tasks 
 * @returns {{ total: number, pending: number, completed: number, completionPercentage: number }}
 */
export function getTaskStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const completionPercentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    total,
    pending,
    completed,
    completionPercentage
  };
}
