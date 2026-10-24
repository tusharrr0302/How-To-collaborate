# Contributing to DevBoard

Thank you for your interest in contributing to **DevBoard**! This project is designed as both a practical task management application and a hands-on learning environment for Git, GitHub, version control workflows, Pull Requests, and collaborative code reviews.

Whether you are fixing a typo in documentation, solving a bug, or implementing a new feature, this guide will walk you through our recommended workflow.

---

## Table of Contents
1. [Code of Conduct & Community Standards](#code-of-conduct--community-standards)
2. [Getting Started (Fork & Clone)](#getting-started-fork--clone)
3. [Branching Strategy](#branching-strategy)
4. [Syncing With Upstream & Resolving Conflicts](#syncing-with-upstream--resolving-conflicts)
5. [Writing Focused Commits](#writing-focused-commits)
6. [Reporting Bugs & Proposing Features](#reporting-bugs--proposing-features)
7. [Submitting a Pull Request](#submitting-a-pull-request)
8. [Code Quality Guidelines](#code-quality-guidelines)
9. [Code Review Etiquette](#code-review-etiquette)

---

## Code of Conduct & Community Standards

We are committed to providing a welcoming, friendly, and harassment-free experience for everyone, regardless of experience level, background, or identity.

- **Be respectful and constructive:** Treat fellow contributors with kindness and patience.
- **Give actionable feedback:** When reviewing code, explain *why* a change is suggested and highlight positive contributions.
- **Learn together:** Questions are always encouraged—this project exists to teach and learn!

---

## Getting Started (Fork & Clone)

### 1. Fork the Repository
Click the **Fork** button at the top-right of the DevBoard GitHub repository page to create a personal copy under your GitHub account.

### 2. Clone Your Fork Locally
Open your terminal and clone your fork to your computer:

```bash
git clone https://github.com/<your-username>/How-To-collaborate.git
cd How-To-collaborate
```

### 3. Add the Upstream Remote
Keep your fork synchronized with the original repository by adding an `upstream` remote:

```bash
git remote add upstream https://github.com/tusharrr0302/How-To-collaborate.git
git remote -v
```

---

## Branching Strategy

Never make changes directly on your `main` branch. Always create a dedicated, descriptively named branch for each task.

### Branch Naming Conventions

Use lowercase names with hyphens and a category prefix:

| Type | Prefix | Example |
| :--- | :--- | :--- |
| Bug fix | `fix/` | `fix/empty-title-validation` |
| New feature | `feat/` | `feat/task-search` |
| Enhancement | `enhancement/` | `enhancement/mobile-tap-targets` |
| Accessibility | `a11y/` | `a11y/focus-indicators` |
| Documentation | `docs/` | `docs/improve-setup-guide` |

### Creating Your Branch

Make sure your `main` is up-to-date with upstream before creating your branch:

```bash
git checkout main
git fetch upstream
git merge upstream/main
git checkout -b feat/my-new-feature
```

---

## Syncing With Upstream & Resolving Conflicts

While you work, the original repository may move ahead. Bring those changes in **before** you open your pull request:

```bash
git fetch upstream              # download new upstream commits, change nothing
git merge upstream/main         # fold them into your current branch
```

If both you and upstream touched the same lines, Git stops and marks a **merge conflict**:

```
<<<<<<< HEAD
Your version of the line
=======
Upstream's version of the line
>>>>>>> upstream/main
```

Resolve one cleanly:

1. `git status` lists every conflicted file.
2. Open each file, find the `<<<<<<<` / `=======` / `>>>>>>>` markers, and replace all three with the **correct final code** — sometimes that is one side, sometimes a hand-merged mix of both.
3. Stage the resolved file: `git add <file>`.
4. When no conflicts remain, finish the merge: `git commit` (Git pre-fills the message).
5. Changed your mind mid-merge? `git merge --abort` returns the branch to exactly where it was.

```
        A---B---C  upstream/main
             \
              D---E  your branch, after git merge upstream/main
```

> Tip: small, frequent syncs produce smaller, easier conflicts than one big sync on PR day.

---

## Writing Focused Commits

A great commit history makes code easier to review, debug, and understand months later.

### Guidelines for Good Commits:
1. **Keep commits atomic:** Each commit should do one logical thing. Do not bundle an unrelated bug fix, a refactoring, and a CSS tweak into one commit.
2. **Use the imperative mood** in the subject line (e.g., `Add task search filter` rather than `Added task search filter` or `Adds task search filter`).
3. **Limit the subject line to 50–72 characters.**
4. **Provide a body explanation** when the reason behind a change is not obvious from the diff alone.

### Conventional Commits

Prefix the subject with a type so the history scans cleanly (the examples below follow it):

| Type | Use for |
| :--- | :--- |
| `feat:` | A new feature |
| `fix:` | A bug fix |
| `docs:` | Documentation only |
| `style:` | Formatting, whitespace, naming (no logic change) |
| `refactor:` | Restructuring without changing behaviour |
| `a11y:` | Accessibility improvements |
| `test:` | Adding or correcting tests |
| `chore:` | Tooling, config, maintenance |

### Example Commit Messages

**Good:**
```text
feat: add keyword search for task titles and descriptions

Implement real-time search filtering with a clear button and
accessible empty-state feedback when zero matches are found.
```

**Avoid:**
```text
changes
fixed stuff
wip
asdf
```

---

## Reporting Bugs & Proposing Features

Pick the template that fits when you [open a new issue](https://github.com/tusharrr0302/How-To-collaborate/issues/new/choose): [bug report](.github/ISSUE_TEMPLATE/bug_report.md), [feature request](.github/ISSUE_TEMPLATE/feature_request.md), or [documentation task](.github/ISSUE_TEMPLATE/documentation.md). The [label board](https://github.com/tusharrr0302/How-To-collaborate/labels) (`bug`, `enhancement`, `good first issue`, `a11y`, …) shows what maintainers consider the change to be.

Before opening a new issue, please check existing issues to avoid duplicates.

- **Found a bug?** Open an issue using the [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md). Include steps to reproduce, expected vs. actual behavior, and browser details.
- **Have an idea?** Open an issue using the [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md). Describe the user problem and the proposed solution.

---

## Submitting a Pull Request

When your changes are ready and verified locally:

### 1. Push Your Branch
```bash
git push -u origin feat/my-new-feature
```

### 2. Open a Pull Request on GitHub
Navigate to your fork on GitHub. You will see a banner prompting you to **Compare & pull request**.

### 3. Complete the PR Template
- Fill in the provided [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md).
- Reference the issue number you are solving (e.g., `Closes #12`).
- Check off items in the contributor checklist.
- Add screenshots or recordings if you made visual changes.

---

## Code Quality Guidelines

To keep DevBoard approachable for learners:

1. **Vanilla Stack Only:** Do not introduce build tools, bundlers, React, Vue, jQuery, or CSS frameworks unless explicitly discussed in an issue first.
2. **Modular Architecture:**
   - Put data persistence logic in `js/storage.js`.
   - Put business logic and pure calculations in `js/tasks.js`.
   - Put DOM rendering and modal controls in `js/ui.js`.
   - Wire event listeners and state synchronization in `js/app.js`.
3. **Security (No Unsafe HTML):**
   - **Never** inject user-provided text with `.innerHTML = task.title`.
   - Always use `.textContent`, `document.createElement`, or safe escaping.
4. **Accessibility (a11y):**
   - Ensure all controls can be reached and activated using only the keyboard (`Tab`, `Space`, `Enter`, `Escape`).
   - Maintain visible focus indicators on all interactive elements.
   - Use semantic HTML tags (`<button>`, `<header>`, `<main>`, `<article>`, `<dialog>`).

---

## Code Review Etiquette

Code reviews are a mutual learning conversation, not an exam.

- **For Reviewers:**
  - Be welcoming, empathetic, and constructive.
  - Praise elegant code and good documentation.
  - Distinguish between mandatory fixes (bugs, security, broken tests) and non-blocking suggestions (style preferences).
- **For Authors:**
  - Remember that critiques are about the code, not you as a person.
  - If a reviewer suggests changes, address them in new commits pushed to your branch—the PR will update automatically.
  - Don't hesitate to ask for clarification if a comment isn't clear!

### Handling Review Feedback in Git

```bash
# usual case: the branch is already public on your fork — add a new commit
git add <changed-files>
git commit -m "fix: tighten validation after review"
git push                        # the PR updates itself

# only for commits not pushed anywhere yet: fold fixes into the last commit
git add <changed-files>
git commit --amend --no-edit
```

Never rewrite (`--amend`, `rebase`) commits that are already on the PR — it force-pushes away the review conversation context. After pushing, reply to each comment and re-request a review so your reviewer gets notified.
