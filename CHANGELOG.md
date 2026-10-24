# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Localization:** English / Simplified Chinese UI with a header language switcher, persisted language preference, localized date formatting, and localized workshop demo tasks.

## [1.0.0] - 2026-10-24

### Added
- **Core Architecture:** Modular pure vanilla JavaScript implementation (`storage.js`, `tasks.js`, `ui.js`, `app.js`) using native ES modules without any build step.
- **Task Management:** Full CRUD support for tasks with titles, descriptions, and customizable category tags (`feature`, `bug`, `enhancement`, `documentation`, `task`).
- **Defensive Storage Engine:** Resilient `localStorage` serialization with schema sanitization, missing timestamp recovery, and corrupt data self-healing.
- **Filtering & Search:** Real-time search query matching across titles and labels, segmented filter controls (`All`, `Pending`, `Completed`), and live dynamic badges.
- **Metrics Dashboard:** Real-time counters for Total, Pending, and Completed tasks with an animated percentage progress indicator.
- **Accessibility & Focus Management:** Semantic HTML5 landmarks, modal focus-trapping dialogs, keyboard navigation (`N` for new task, `/` for search, `Esc` to dismiss dialogs, `?` for shortcut cheatsheet).
- **Dark Mode UI:** GitHub-inspired dark color palette with accessible contrast ratios, CSS custom properties, and responsive layout.
- **Community & Collaboration Setup:** Comprehensive `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, GitHub issue forms, and PR templates.
- **CI / CD Automation:** GitHub Pages automated deployment workflow and syntax validation actions.
