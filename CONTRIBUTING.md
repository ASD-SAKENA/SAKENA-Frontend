# Contributing

## Before you start

Read [CLAUDE.md](CLAUDE.md) — it holds the rules this codebase is actually
held to: which libraries to use, where each kind of file belongs, and the
patterns that are deliberately forbidden.

## Setup

```bash
pnpm install
cp .env.example .env
pnpm dev
```

## Branching and commits

Branch from `main` as `feat/…`, `fix/…`, `refactor/…`, `docs/…`.

Commits follow [Conventional Commits](https://www.conventionalcommits.org):

```
fix(reserve): let residents book a slot that still has free seats
```

Write the body to explain **why**, not what. When a commit fixes a bug, say
what the bug did to a user.

## The bar for a pull request

- `pnpm test` and `pnpm check` both pass.
- New behaviour has a test. A bug fix has a test that fails without the fix.
- The layer rules in CLAUDE.md hold: API calls in `api/`, hooks in `queries/`,
  no `fetch`, no inline query keys.
- User-facing text is Persian and reads naturally — not translated English.
- Anything visible was looked at in RTL, at a narrow width, and in both
  themes.

## A note on validation

Form schemas must match what the backend accepts. A schema that is looser
than the API produces a form that passes and then fails on submit — this has
already happened twice (a 4000-character reply against a 2000-character
column, and decimals against a whole-number endpoint). When you write a
schema, check the DTO it will be posted to.
