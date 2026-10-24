/**
 * i18n.js
 * DevBoard - Lightweight English / Simplified Chinese localization.
 *
 * Static markup is translated through selector bindings, while JS-generated
 * strings use the `t(key, params)` helper. The language choice is persisted
 * in localStorage and exposed through a `devboard:languagechange` event.
 */

const LANG_STORAGE_KEY = 'devboard_lang';

const translations = {
  en: {
    'app.title': 'DevBoard — Git & GitHub Learning Project',
    'app.description': 'DevBoard — A modern, accessible task management app designed as a hands-on learning project for Git, GitHub, Pull Requests, and collaborative software engineering.',

    'nav.workspace': 'WORKSPACE',
    'nav.gitEnvironment': 'GIT ENVIRONMENT',
    'nav.board': 'Task Board',
    'nav.workshop': 'Workshop Scenarios',
    'nav.shortcuts': 'Shortcuts',
    'nav.branch': 'main branch',
    'nav.storageStatus': 'Client-only LocalStorage persistence active. Ready for commit demonstration.',
    'nav.resetSamples': 'Reset Demo Tasks',
    'nav.repoBadge': 'git learning project',
    'nav.repoMeta': 'Open source demonstration',

    'header.searchPlaceholder': 'Search tasks... (Press / to focus)',
    'header.searchAria': 'Search tasks by title, description or label',
    'header.clearSearch': 'Clear search query',
    'header.newTask': 'New Task',
    'header.language': 'Language',
    'brand.versionTitle': 'Demonstration Project Version',
    'nav.resetSamplesTitle': 'Restore sample tasks for testing',

    'stats.total': 'Total Tasks',
    'stats.pending': 'Pending',
    'stats.completed': 'Completed',
    'stats.progress': 'Progress',
    'stats.totalDesc': 'Tracked work items',
    'stats.pendingDesc': 'Awaiting resolution',
    'stats.completedDesc': 'Merged / Done',
    'stats.progressDesc': 'Task completion velocity',
    'stats.percent': '{percent}% completed',
    'stats.overviewHeading': 'Project Metrics Overview',
    'aria.appNav': 'Application navigation',

    'create.heading': 'Create Task',
    'create.helper': 'Add a work item to track in your git branch',
    'create.titleLabel': 'Task Title',
    'create.titleLabelHtml': 'Task Title <span class="required-indicator" aria-hidden="true">*</span>',
    'create.titlePlaceholder': 'e.g., Fix empty title validation in task creation',
    'create.labelLabel': 'Label',
    'create.descriptionLabel': 'Description',
    'create.descriptionLabelHtml': 'Description <span class="label-optional">(optional)</span>',
    'create.descPlaceholder': 'Provide context, acceptance criteria, or relevant file paths...',
    'create.tipHtml': '<span class="tip-pill">Tip</span> Press <kbd class="shortcut-key">N</kbd> from anywhere to jump here',
    'create.submit': 'Create Task',

    'tasks.heading': 'Tasks',
    'tasks.listAria': 'DevBoard tasks list',
    'filter.groupAria': 'Filter tasks by completion status',
    'filter.all': 'All',
    'filter.pending': 'Pending',
    'filter.completed': 'Completed',

    'label.task': 'task',
    'label.feature': 'feature',
    'label.bug': 'bug',
    'label.enhancement': 'enhancement',
    'label.documentation': 'documentation',

    'edit.title': 'Edit Task',
    'edit.closeAria': 'Close edit dialog',
    'edit.cancel': 'Cancel',
    'edit.save': 'Save Changes',

    'delete.title': 'Delete Task',
    'delete.closeAria': 'Close delete confirmation',
    'delete.description': 'Are you sure you want to permanently delete this task? This action cannot be undone.',
    'delete.cancel': 'Cancel',
    'delete.confirm': 'Delete Task',

    'workshop.title': 'Git & GitHub Workshop Scenarios',
    'workshop.subtitle': 'Practical issues designed for live branch, PR, and code review practice',
    'workshop.closeAria': 'Close workshop scenarios dialog',
    'workshop.intro': 'Use these curated scenarios to teach version control, branch naming, issue tracking, and pull request reviews. Each scenario represents a real-world software development task.',
    'workshop.close': 'Close Guide',
    'workshop.tag.bug': 'bug',
    'workshop.tag.feature': 'feature',
    'workshop.tag.enhancement': 'enhancement',
    'workshop.tag.documentation': 'documentation',
    'workshop.s1.title': 'Empty task titles are accepted',
    'workshop.s1.desc': '<strong>Problem:</strong> Submitting spaces or blank titles creates ghost tasks on the board.',
    'workshop.s1.meta': '<strong>Acceptance Criteria:</strong> Validate with <code>trim()</code>, show visual error banner, keep focus on input. Suggested branch: <code>fix/empty-title-validation</code>.',
    'workshop.s2.title': 'Filter tasks by completion status',
    'workshop.s2.desc': '<strong>Problem:</strong> As tasks accumulate, users need to focus on remaining pending work or review finished items.',
    'workshop.s2.meta': '<strong>Acceptance Criteria:</strong> Segmented control with "All", "Pending", and "Completed" with updated badges. Suggested branch: <code>feat/status-filters</code>.',
    'workshop.s3.title': 'Add task search',
    'workshop.s3.desc': '<strong>Problem:</strong> Quickly locate tasks by keyword in title, description, or label.',
    'workshop.s3.meta': '<strong>Acceptance Criteria:</strong> Real-time filtering, clear button, informative zero-result state. Suggested branch: <code>feat/task-search</code>.',
    'workshop.s4.title': 'Task counts become incorrect after deletion',
    'workshop.s4.desc': '<strong>Problem:</strong> Deleting a completed or pending task should immediately recalculate statistics.',
    'workshop.s4.meta': '<strong>Acceptance Criteria:</strong> Task counters and progress bars synchronize after every deletion. Suggested branch: <code>fix/counter-sync-on-delete</code>.',
    'workshop.s5.title': 'Improve mobile responsiveness',
    'workshop.s5.desc': '<strong>Problem:</strong> Ensure buttons have 44px touch targets and layout cleanly folds on phones.',
    'workshop.s5.meta': '<strong>Acceptance Criteria:</strong> Responsive grid, no horizontal scroll, accessible buttons on mobile. Suggested branch: <code>enhancement/mobile-layout</code>.',
    'workshop.s6.title': 'Improve local setup instructions',
    'workshop.s6.desc': '<strong>Problem:</strong> Beginners need clear step-by-step instructions for running without tooling or servers.',
    'workshop.s6.meta': '<strong>Acceptance Criteria:</strong> Document Python http.server, VS Code Live Server, and double-click opening. Suggested branch: <code>docs/setup-instructions</code>.',
    'workshop.s7.title': 'Add keyboard support and clearer focus indicators',
    'workshop.s7.desc': '<strong>Problem:</strong> Keyboard-only developers need visual focus rings and standard shortcuts.',
    'workshop.s7.meta': '<strong>Acceptance Criteria:</strong> Focus indicators with <code>:focus-visible</code>, Escape key modal closing, N/slash shortcuts. Suggested branch: <code>a11y/keyboard-navigation</code>.',

    'shortcuts.title': 'Keyboard Shortcuts',
    'shortcuts.closeAria': 'Close shortcuts dialog',
    'shortcuts.focusNew': 'Focus new task input',
    'shortcuts.focusSearch': 'Focus search bar',
    'shortcuts.closeModal': 'Close any modal',
    'shortcuts.showShortcuts': 'Show keyboard shortcuts',
    'shortcuts.gotIt': 'Got it',

    'toast.dismiss': 'Dismiss notification',
    'toast.recovered': 'Recovered storage from malformed task data.',
    'toast.storageError': 'Storage error: {error}',
    'toast.taskCreated': 'Task "{title}" created.',
    'toast.taskUpdated': 'Task "{title}" updated.',
    'toast.taskDeleted': 'Deleted task "{title}".',
    'toast.taskCompleted': 'Task marked as completed.',
    'toast.taskPending': 'Task marked as pending.',
    'toast.samplesRestored': 'Restored workshop demonstration tasks.',

    'error.validTitle': 'Please enter a valid title.',
    'error.createTask': 'Failed to create task.',
    'error.updateTask': 'Failed to update task.',
    'error.toggleTask': 'Failed to toggle task.',
    'error.deleteTask': 'Task could not be deleted.',
    'error.taskNotFound': 'Task not found.',

    'validation.text': 'Task title must be text.',
    'validation.empty': 'Task title cannot be empty or just whitespace.',
    'validation.tooLong': 'Task title must be 150 characters or fewer.',

    'aria.taskLabel': 'Task: {title}',
    'aria.markCompleted': 'Mark task "{title}" as completed',
    'aria.markPending': 'Mark task "{title}" as pending',
    'aria.editTask': 'Edit task: {title}',
    'aria.deleteTask': 'Delete task: {title}',
    'aria.noTasks': 'No tasks on the board.',
    'aria.noMatch': 'No matching tasks found.',
    'aria.statusShowing': 'Showing {count} tasks.',

    'task.createdAt': 'Created {time}',
    'task.edit': 'Edit',
    'task.delete': 'Delete',

    'empty.noTasksTitle': 'No tasks on the board',
    'empty.noTasksDesc': 'Your task board is completely empty. Create a new task above or load realistic Git workshop scenarios to start testing.',
    'empty.loadSamples': 'Load Workshop Demo Tasks',
    'empty.noMatchTitle': 'No matching tasks found',
    'empty.noMatchBoth': 'No tasks with status "{status}" matching "{query}". Try adjusting your search term or filter.',
    'empty.noMatchStatus': 'No tasks with status "{status}". Try adjusting your filter.',
    'empty.noMatchQuery': 'No tasks matching "{query}". Try adjusting your search term.',
    'empty.clearFilters': 'Clear Filters & Search',

    'time.recently': 'Recently',

    'sample.task1.title': 'Setup Git and GitHub repository workflow',
    'sample.task1.desc': 'Initialize repo, create .gitignore, and configure issue templates for team collaboration.',
    'sample.task2.title': 'Validate task title inputs against empty submissions',
    'sample.task2.desc': 'Ensure trim() is applied and user gets immediate visual feedback when title is empty.',
    'sample.task3.title': 'Implement search and status filter synchronization',
    'sample.task3.desc': 'Ensure task counters stay in sync when filtering by All, Pending, or Completed status.'
  },

  zh: {
    'app.title': 'DevBoard — Git 与 GitHub 学习项目',
    'app.description': 'DevBoard — 一个现代化、无障碍的任务管理应用，用作 Git、GitHub、Pull Request 与协作开发的动手学习项目。',

    'nav.workspace': '工作区',
    'nav.gitEnvironment': 'GIT 环境',
    'nav.board': '任务看板',
    'nav.workshop': '工作坊场景',
    'nav.shortcuts': '快捷键',
    'nav.branch': 'main 分支',
    'nav.storageStatus': '仅使用浏览器 LocalStorage 持久化，可用于提交演示。',
    'nav.resetSamples': '重置演示任务',
    'nav.repoBadge': 'Git 学习项目',
    'nav.repoMeta': '开源演示',

    'header.searchPlaceholder': '搜索任务…（按 / 聚焦）',
    'header.searchAria': '按标题、描述或标签搜索任务',
    'header.clearSearch': '清除搜索内容',
    'header.newTask': '新建任务',
    'header.language': '语言',
    'brand.versionTitle': '演示项目版本',
    'nav.resetSamplesTitle': '恢复用于测试的示例任务',

    'stats.total': '任务总数',
    'stats.pending': '待完成',
    'stats.completed': '已完成',
    'stats.progress': '进度',
    'stats.totalDesc': '已跟踪的工作项',
    'stats.pendingDesc': '等待处理',
    'stats.completedDesc': '已合并 / 完成',
    'stats.progressDesc': '任务完成速度',
    'stats.percent': '{percent}% 已完成',
    'stats.overviewHeading': '项目指标概览',
    'aria.appNav': '应用导航',

    'create.heading': '创建任务',
    'create.helper': '添加一个工作项，跟踪你的 Git 分支进度',
    'create.titleLabel': '任务标题',
    'create.titleLabelHtml': '任务标题 <span class="required-indicator" aria-hidden="true">*</span>',
    'create.titlePlaceholder': '例如：修复任务创建中的空标题校验',
    'create.labelLabel': '标签',
    'create.descriptionLabel': '描述',
    'create.descriptionLabelHtml': '描述 <span class="label-optional">（可选）</span>',
    'create.descPlaceholder': '补充背景、验收标准或相关文件路径…',
    'create.tipHtml': '<span class="tip-pill">提示</span>在任意位置按 <kbd class="shortcut-key">N</kbd> 即可跳到这里',
    'create.submit': '创建任务',

    'tasks.heading': '任务',
    'tasks.listAria': 'DevBoard 任务列表',
    'filter.groupAria': '按完成状态筛选任务',
    'filter.all': '全部',
    'filter.pending': '待完成',
    'filter.completed': '已完成',

    'label.task': '任务',
    'label.feature': '功能',
    'label.bug': '缺陷',
    'label.enhancement': '改进',
    'label.documentation': '文档',

    'edit.title': '编辑任务',
    'edit.closeAria': '关闭编辑对话框',
    'edit.cancel': '取消',
    'edit.save': '保存修改',

    'delete.title': '删除任务',
    'delete.closeAria': '关闭删除确认',
    'delete.description': '确定要永久删除这个任务吗？此操作无法撤销。',
    'delete.cancel': '取消',
    'delete.confirm': '删除任务',

    'workshop.title': 'Git 与 GitHub 工作坊场景',
    'workshop.subtitle': '用于分支、PR 与代码审查实战的练习任务',
    'workshop.closeAria': '关闭工作坊场景对话框',
    'workshop.intro': '使用这些精选场景来练习版本控制、分支命名、Issue 跟踪和 Pull Request 审查。每个场景都对应一个真实的软件开发任务。',
    'workshop.close': '关闭指南',
    'workshop.tag.bug': '缺陷',
    'workshop.tag.feature': '功能',
    'workshop.tag.enhancement': '改进',
    'workshop.tag.documentation': '文档',
    'workshop.s1.title': '空任务标题会被接受',
    'workshop.s1.desc': '<strong>问题：</strong>提交空格或空白标题会在看板上创建幽灵任务。',
    'workshop.s1.meta': '<strong>验收标准：</strong>使用 <code>trim()</code> 校验，显示可视化错误提示，保持输入框焦点。建议分支：<code>fix/empty-title-validation</code>。',
    'workshop.s2.title': '按完成状态筛选任务',
    'workshop.s2.desc': '<strong>问题：</strong>任务越积越多时，用户需要专注于剩余待办或回顾已完成事项。',
    'workshop.s2.meta': '<strong>验收标准：</strong>提供“全部”“待完成”“已完成”分段控件，并同步更新计数徽章。建议分支：<code>feat/status-filters</code>。',
    'workshop.s3.title': '添加任务搜索',
    'workshop.s3.desc': '<strong>问题：</strong>需要按标题、描述或标签中的关键词快速定位任务。',
    'workshop.s3.meta': '<strong>验收标准：</strong>实时过滤、清除按钮、信息明确的零结果状态。建议分支：<code>feat/task-search</code>。',
    'workshop.s4.title': '删除后任务计数不正确',
    'workshop.s4.desc': '<strong>问题：</strong>删除已完成或待完成任务后，统计数字应立即重新计算。',
    'workshop.s4.meta': '<strong>验收标准：</strong>每次删除后任务计数和进度条保持同步。建议分支：<code>fix/counter-sync-on-delete</code>。',
    'workshop.s5.title': '改进移动端响应式布局',
    'workshop.s5.desc': '<strong>问题：</strong>确保按钮具有 44px 触控目标，布局在手机上能整齐折叠。',
    'workshop.s5.meta': '<strong>验收标准：</strong>响应式网格、无横向滚动、移动端按钮可访问。建议分支：<code>enhancement/mobile-layout</code>。',
    'workshop.s6.title': '改进本地启动说明',
    'workshop.s6.desc': '<strong>问题：</strong>初学者需要清晰的分步说明，以便在没有工具或服务器的情况下运行项目。',
    'workshop.s6.meta': '<strong>验收标准：</strong>记录 Python http.server、VS Code Live Server 和双击打开的方式。建议分支：<code>docs/setup-instructions</code>。',
    'workshop.s7.title': '添加键盘支持与更清晰的焦点指示',
    'workshop.s7.desc': '<strong>问题：</strong>只使用键盘的开发者需要可见的焦点环和标准快捷键。',
    'workshop.s7.meta': '<strong>验收标准：</strong>使用 <code>:focus-visible</code> 焦点指示、Esc 关闭弹窗、N 与 / 快捷键。建议分支：<code>a11y/keyboard-navigation</code>。',

    'shortcuts.title': '键盘快捷键',
    'shortcuts.closeAria': '关闭快捷键对话框',
    'shortcuts.focusNew': '聚焦新建任务输入框',
    'shortcuts.focusSearch': '聚焦搜索框',
    'shortcuts.closeModal': '关闭任意弹窗',
    'shortcuts.showShortcuts': '显示键盘快捷键',
    'shortcuts.gotIt': '知道了',

    'toast.dismiss': '关闭通知',
    'toast.recovered': '已从损坏的任务数据中恢复存储。',
    'toast.storageError': '存储错误：{error}',
    'toast.taskCreated': '任务「{title}」已创建。',
    'toast.taskUpdated': '任务「{title}」已更新。',
    'toast.taskDeleted': '已删除任务「{title}」。',
    'toast.taskCompleted': '任务已标记为完成。',
    'toast.taskPending': '任务已标记为待完成。',
    'toast.samplesRestored': '已恢复工作坊演示任务。',

    'error.validTitle': '请输入有效的标题。',
    'error.createTask': '创建任务失败。',
    'error.updateTask': '更新任务失败。',
    'error.toggleTask': '切换任务状态失败。',
    'error.deleteTask': '无法删除任务。',
    'error.taskNotFound': '未找到任务。',

    'validation.text': '任务标题必须是文本。',
    'validation.empty': '任务标题不能为空或只包含空白字符。',
    'validation.tooLong': '任务标题不能超过 150 个字符。',

    'aria.taskLabel': '任务：{title}',
    'aria.markCompleted': '将任务「{title}」标记为完成',
    'aria.markPending': '将任务「{title}」标记为待完成',
    'aria.editTask': '编辑任务：{title}',
    'aria.deleteTask': '删除任务：{title}',
    'aria.noTasks': '看板上没有任务。',
    'aria.noMatch': '没有找到匹配的任务。',
    'aria.statusShowing': '正在显示 {count} 个任务。',

    'task.createdAt': '创建于 {time}',
    'task.edit': '编辑',
    'task.delete': '删除',

    'empty.noTasksTitle': '看板上还没有任务',
    'empty.noTasksDesc': '任务看板是空的。在上方创建新任务，或加载 Git 工作坊场景开始体验。',
    'empty.loadSamples': '加载工作坊演示任务',
    'empty.noMatchTitle': '没有找到匹配的任务',
    'empty.noMatchBoth': '没有状态为“{status}”且匹配“{query}”的任务。请调整搜索词或筛选条件。',
    'empty.noMatchStatus': '没有状态为“{status}”的任务。请调整筛选条件。',
    'empty.noMatchQuery': '没有匹配“{query}”的任务。请调整搜索词。',
    'empty.clearFilters': '清除筛选与搜索',

    'time.recently': '刚刚',

    'sample.task1.title': '配置 Git 与 GitHub 仓库工作流',
    'sample.task1.desc': '初始化仓库、创建 .gitignore，并配置用于团队协作的 Issue 模板。',
    'sample.task2.title': '校验任务标题的空提交',
    'sample.task2.desc': '确保应用 trim()，并在标题为空时给用户即时的可视化反馈。',
    'sample.task3.title': '实现搜索与状态筛选同步',
    'sample.task3.desc': '确保按全部、待完成或已完成筛选时，任务计数保持同步。'
  }
};

const staticBindings = [
  { selector: '.lang-switch', attr: 'aria-label', key: 'header.language' },
  { selector: '.brand-version', attr: 'title', key: 'brand.versionTitle' },
  { selector: '#reset-samples-btn', attr: 'title', key: 'nav.resetSamplesTitle' },
  { selector: '.app-sidebar', attr: 'aria-label', key: 'aria.appNav' },
  { selector: '#overview-heading', key: 'stats.overviewHeading' },
  { selector: '.nav-group-label', keys: ['nav.workspace', 'nav.gitEnvironment'] },
  { selector: 'a.nav-link.active span', key: 'nav.board' },
  { selector: '#open-workshop-btn span:not(.nav-pill)', key: 'nav.workshop' },
  { selector: '#open-shortcuts-btn span:not(.shortcut-key)', key: 'nav.shortcuts' },
  { selector: '.branch-label', key: 'nav.branch' },
  { selector: '.git-status-text', key: 'nav.storageStatus' },
  { selector: '#reset-samples-btn span', key: 'nav.resetSamples' },
  { selector: '.repo-badge', key: 'nav.repoBadge' },
  { selector: '.repo-meta', key: 'nav.repoMeta' },

  { selector: '#search-input', attr: 'placeholder', key: 'header.searchPlaceholder' },
  { selector: '#search-input', attr: 'aria-label', key: 'header.searchAria' },
  { selector: '#clear-search-btn', attr: 'aria-label', key: 'header.clearSearch' },
  { selector: '.jump-new-task-btn span', key: 'header.newTask' },

  { selector: '.stat-label', keys: ['stats.total', 'stats.pending', 'stats.completed', 'stats.progress'] },
  { selector: '.stat-desc', keys: ['stats.totalDesc', 'stats.pendingDesc', 'stats.completedDesc', 'stats.progressDesc'] },

  { selector: '#create-heading span', key: 'create.heading' },
  { selector: '.card-helper-text', key: 'create.helper' },
  { selector: 'label[for="task-title-input"], label[for="edit-title-input"]', html: 'create.titleLabelHtml' },
  { selector: '#task-title-input', attr: 'placeholder', key: 'create.titlePlaceholder' },
  { selector: 'label[for="task-label-select"], label[for="edit-label-select"]', key: 'create.labelLabel' },
  { selector: 'label[for="task-desc-input"], label[for="edit-desc-input"]', html: 'create.descriptionLabelHtml' },
  { selector: '#task-desc-input', attr: 'placeholder', key: 'create.descPlaceholder' },
  { selector: '.keyboard-tip', html: 'create.tipHtml' },
  { selector: '#new-task-form button[type="submit"] span', key: 'create.submit' },

  { selector: '#tasks-heading', key: 'tasks.heading' },
  { selector: '.filter-group', attr: 'aria-label', key: 'filter.groupAria' },
  { selector: '#task-list', attr: 'aria-label', key: 'tasks.listAria' },
  { selector: '.filter-btn[data-filter="all"] span:first-child', key: 'filter.all' },
  { selector: '.filter-btn[data-filter="pending"] span:first-child', key: 'filter.pending' },
  { selector: '.filter-btn[data-filter="completed"] span:first-child', key: 'filter.completed' },

  { selector: 'select option[value="task"]', key: 'label.task' },
  { selector: 'select option[value="feature"]', key: 'label.feature' },
  { selector: 'select option[value="bug"]', key: 'label.bug' },
  { selector: 'select option[value="enhancement"]', key: 'label.enhancement' },
  { selector: 'select option[value="documentation"]', key: 'label.documentation' },

  { selector: '#edit-modal-title', key: 'edit.title' },
  { selector: '#close-edit-modal', attr: 'aria-label', key: 'edit.closeAria' },
  { selector: '#cancel-edit-btn', key: 'edit.cancel' },
  { selector: '#edit-task-form button[type="submit"]', key: 'edit.save' },

  { selector: '#delete-modal-title', key: 'delete.title' },
  { selector: '#close-delete-modal', attr: 'aria-label', key: 'delete.closeAria' },
  { selector: '#delete-modal-desc', key: 'delete.description' },
  { selector: '#cancel-delete-btn', key: 'delete.cancel' },
  { selector: '#confirm-delete-btn', key: 'delete.confirm' },

  { selector: '#workshop-modal-title', key: 'workshop.title' },
  { selector: '.modal-subtitle', key: 'workshop.subtitle' },
  { selector: '#close-workshop-modal', attr: 'aria-label', key: 'workshop.closeAria' },
  { selector: '.workshop-intro', key: 'workshop.intro' },
  { selector: '.scenario-title', keys: ['workshop.s1.title', 'workshop.s2.title', 'workshop.s3.title', 'workshop.s4.title', 'workshop.s5.title', 'workshop.s6.title', 'workshop.s7.title'] },
  { selector: '.scenario-desc', htmlKeys: ['workshop.s1.desc', 'workshop.s2.desc', 'workshop.s3.desc', 'workshop.s4.desc', 'workshop.s5.desc', 'workshop.s6.desc', 'workshop.s7.desc'] },
  { selector: '.scenario-meta', htmlKeys: ['workshop.s1.meta', 'workshop.s2.meta', 'workshop.s3.meta', 'workshop.s4.meta', 'workshop.s5.meta', 'workshop.s6.meta', 'workshop.s7.meta'] },
  { selector: '.scenario-item .task-tag', keys: ['workshop.tag.bug', 'workshop.tag.feature', 'workshop.tag.feature', 'workshop.tag.bug', 'workshop.tag.enhancement', 'workshop.tag.documentation', 'workshop.tag.enhancement'] },
  { selector: '#workshop-modal .modal-footer button', key: 'workshop.close' },

  { selector: '#shortcuts-modal-title', key: 'shortcuts.title' },
  { selector: '#close-shortcuts-modal', attr: 'aria-label', key: 'shortcuts.closeAria' },
  { selector: '.shortcut-desc', keys: ['shortcuts.focusNew', 'shortcuts.focusSearch', 'shortcuts.closeModal', 'shortcuts.showShortcuts'] },
  { selector: '#shortcuts-modal .modal-footer button', key: 'shortcuts.gotIt' }
];

let currentLang = 'en';
let switchBound = false;

/**
 * Translate a key with optional `{param}` interpolation.
 * @param {string} key
 * @param {Record<string, string | number>} [params]
 * @returns {string}
 */
export function t(key, params = {}) {
  const dict = translations[currentLang] || translations.en;
  const template = dict[key] ?? translations.en[key] ?? key;
  return String(template).replace(/\{(\w+)\}/g, (match, name) => {
    return Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : match;
  });
}

/**
 * @returns {'en' | 'zh'}
 */
export function getLanguage() {
  return currentLang;
}

/**
 * @returns {string} BCP-47 locale used for Intl formatting.
 */
export function getLocale() {
  return currentLang === 'zh' ? 'zh-CN' : 'en-US';
}

/**
 * Persists and applies a new language.
 * @param {'en' | 'zh'} lang
 */
export function setLanguage(lang) {
  if (!translations[lang] || lang === currentLang) return;
  currentLang = lang;
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // localStorage may be unavailable; translation still applies for this session.
  }
  applyLanguage();
  document.dispatchEvent(new CustomEvent('devboard:languagechange', { detail: { language: lang } }));
}

/**
 * Reads the saved language, applies it, and wires up the switcher.
 */
export function initI18n() {
  let saved = null;
  try {
    saved = localStorage.getItem(LANG_STORAGE_KEY);
  } catch {
    saved = null;
  }

  const browserLang = (navigator.language || 'en').toLowerCase();
  currentLang = saved === 'zh' || saved === 'en'
    ? saved
    : (browserLang.startsWith('zh') ? 'zh' : 'en');

  applyLanguage();

  if (!switchBound) {
    switchBound = true;
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });
  }
}

/**
 * Applies the current language to document metadata and all static bindings.
 */
function applyLanguage() {
  document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
  document.title = t('app.title');

  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', t('app.description'));

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    const isActive = btn.dataset.lang === currentLang;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });

  applyStaticTranslations();
}

/**
 * Applies text/attribute translations declared in `staticBindings`.
 */
function applyStaticTranslations() {
  for (const binding of staticBindings) {
    const nodes = document.querySelectorAll(binding.selector);
    if (nodes.length === 0) continue;

    nodes.forEach((node, index) => {
      let key = binding.key;
      let html = false;

      if (binding.keys) {
        key = binding.keys[index];
      } else if (binding.htmlKeys) {
        key = binding.htmlKeys[index];
        html = true;
      } else if (binding.html) {
        key = binding.html;
        html = true;
      }

      if (!key) return;

      const value = t(key);
      if (html) {
        node.innerHTML = value;
      } else if (binding.attr) {
        node.setAttribute(binding.attr, value);
      } else {
        node.textContent = value;
      }
    });
  }
}