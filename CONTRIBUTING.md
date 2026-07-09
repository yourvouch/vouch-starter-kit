# Contributing to Vouch Starter Kit

Thank you for your interest in contributing. Vouch is built in the open and every contribution — no matter how small — matters.

---

## Ways to Contribute

- **Report a bug** — open an issue with clear steps to reproduce
- **Suggest a feature** — open an issue describing the problem you want solved
- **Improve documentation** — fix typos, clarify wording, add examples
- **Write code** — pick up an open issue or propose something new
- **Review pull requests** — feedback from the community helps maintain quality

---

## Before You Start

1. Check [open issues](../../issues) and [pull requests](../../pulls) to avoid duplicating work
2. For significant changes, open an issue first to discuss the approach
3. For small fixes (typos, broken links), feel free to submit a PR directly

---

## Development Setup

Requirements: Node.js 20+ and npm.

```bash
git clone https://github.com/yourvouch/vouch-starter-kit.git
cd vouch-starter-kit
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The upload page has a **"Try with sample data"** button, so you can explore the full dashboard without a CSV of your own.

Before opening a pull request, run all three of these and make sure they pass:

```bash
npm run test    # unit tests (Vitest)
npm run lint    # ESLint
npm run build   # production build + type check
```

See the [Project Structure](README.md#project-structure) section of the README for an overview of where things live — most application logic lives in `lib/`, and UI in `components/`.

---

## Coding Standards

- Write clear, readable code over clever code
- Keep functions small and focused on a single responsibility
- Add comments only where the *why* isn't obvious from the code itself
- Follow the existing style of the file you're editing
- Write tests for any new behavior you introduce, especially pure functions under `lib/`
- Keep insight calculations deterministic — no AI calls, no fabricated data. If a value can't be computed because a column wasn't mapped, say so clearly instead of guessing

---

## Pull Request Process

1. Fork the repository and create a branch from `main`

```bash
git checkout -b your-feature-name
```

2. Make your changes and commit with a clear message

```bash
git commit -m "Add: short description of what and why"
```

3. Push your branch and open a pull request against `main`

4. Fill in the pull request template — describe what changed and why

5. A maintainer will review your PR; expect feedback within a few days

6. Once approved, a maintainer will merge it

### Commit Message Format

Use a short prefix to make history easy to scan:

| Prefix | When to use |
|--------|-------------|
| `Add:` | New feature or file |
| `Fix:` | Bug fix |
| `Update:` | Change to existing behavior |
| `Remove:` | Deletion of code or file |
| `Docs:` | Documentation only |
| `Chore:` | Tooling, dependencies, config |

---

## Reporting Issues

When reporting a bug, please include:

- A clear, descriptive title
- Steps to reproduce the issue
- What you expected to happen
- What actually happened
- Your environment (OS, browser, version if applicable)

For security vulnerabilities, **do not open a public issue**. See [SECURITY.md](SECURITY.md) instead.

---

## Code of Conduct

By participating in this project, you agree to follow our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## Questions?

Open a [GitHub Discussion](../../discussions) or file an issue tagged `question`. We're happy to help.
