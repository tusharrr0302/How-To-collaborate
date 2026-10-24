/**
 * storage.js
 * DevBoard - Task Persistence Module
 *
 * Handles safe read, write, and validation of tasks to and from localStorage.
 * Includes defensive schema validation to recover gracefully from malformed data.
 */

import { t } from './i18n.js';

const STORAGE_KEY = 'devboard_tasks_v1';

/**
 * Returns the default sample tasks in the active language.
 * @returns {Array<Object>}
 */
export function getDefaultTasks() {
  return [
    {
      id: 'task-101',
      title: t('sample.task1.title'),
      description: t('sample.task1.desc'),
      completed: true,
      label: 'documentation',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'task-102',
      title: t('sample.task2.title'),
      description: t('sample.task2.desc'),
      completed: false,
      label: 'bug',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: null
    },
    {
      id: 'task-103',
      title: t('sample.task3.title'),
      description: t('sample.task3.desc'),
      completed: false,
      label: 'feature',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      updatedAt: null
    }
  ];
}

/**
 * Default sample tasks provided for first-time visitors or workshop demonstrations.
 * Kept as the English baseline; use getDefaultTasks() for localized samples.
 */
export const DEFAULT_TASKS = [
  {
    id: 'task-101',
    title: 'Setup Git and GitHub repository workflow',
    description: 'Initialize repo, create .gitignore, and configure issue templates for team collaboration.',
    completed: true,
    label: 'documentation',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'task-102',
    title: 'Validate task title inputs against empty submissions',
    description: 'Ensure trim() is applied and user gets immediate visual feedback when title is empty.',
    completed: false,
    label: 'bug',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: null
  },
  {
    id: 'task-103',
    title: 'Implement search and status filter synchronization',
    description: 'Ensure task counters stay in sync when filtering by All, Pending, or Completed status.',
    completed: false,
    label: 'feature',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: null
  }
];

/**
 * Validates a single task object against the expected schema.
 * Tolerates missing createdAt by accepting optional timestamps.
 * @param {unknown} item
 * @returns {boolean}
 */
export function isValidTaskSchema(item) {
  if (!item || typeof item !== 'object') return false;
  const candidate = /** @type {Record<string, unknown>} */ (item);
  return (
    typeof candidate.id === 'string' &&
    candidate.id.trim().length > 0 &&
    typeof candidate.title === 'string' &&
    candidate.title.trim().length > 0 &&
    typeof candidate.completed === 'boolean'
  );
}

/**
 * Loads tasks from localStorage with malformed data recovery.
 * @returns {{ tasks: Array<Object>, recovered: boolean, error: string | null }}
 */
export function loadTasksFromStorage() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);

    // First visit: initialize with localized default sample tasks
    if (rawData === null) {
      const defaults = getDefaultTasks();
      saveTasksToStorage(defaults);
      return { tasks: [...defaults], recovered: false, error: null };
    }

    const parsed = JSON.parse(rawData);

    if (!Array.isArray(parsed)) {
      console.warn('[DevBoard Storage] Stored data is not an array. Resetting to empty list.');
      return { tasks: [], recovered: true, error: 'Data was not an array' };
    }

    // Filter out corrupted task entries and ensure valid timestamps
    const validTasks = parsed
      .filter(isValidTaskSchema)
      .map(task => ({
        ...task,
        createdAt: typeof task.createdAt === 'string' ? task.createdAt : new Date().toISOString()
      }));
    const recovered = validTasks.length !== parsed.length;

    if (recovered) {
      console.warn(`[DevBoard Storage] Filtered out ${parsed.length - validTasks.length} malformed task entries.`);
      // Re-save sanitized data
      saveTasksToStorage(validTasks);
    }

    return { tasks: validTasks, recovered, error: null };
  } catch (err) {
    console.error('[DevBoard Storage] Failed to load or parse stored tasks:', err);
    return {
      tasks: [],
      recovered: true,
      error: err instanceof Error ? err.message : 'Unknown storage parse error'
    };
  }
}

/**
 * Persists an array of tasks to localStorage.
 * @param {Array<Object>} tasks
 * @returns {{ success: boolean, error: string | null }}
 */
export function saveTasksToStorage(tasks) {
  if (!Array.isArray(tasks)) {
    return { success: false, error: 'Expected tasks to be an array' };
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return { success: true, error: null };
  } catch (err) {
    console.error('[DevBoard Storage] Failed to save tasks to localStorage:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Storage write failed (quota exceeded or disabled)'
    };
  }
}

/**
 * Resets storage back to default sample tasks.
 * @returns {Array<Object>}
 */
export function resetStorageToDefaults() {
  const defaults = getDefaultTasks();
  saveTasksToStorage(defaults);
  return [...defaults];
}

/**
 * Clears all tasks from storage.
 * @returns {boolean}
 */
export function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (err) {
    console.error('[DevBoard Storage] Failed to clear storage:', err);
    return false;
  }
}
