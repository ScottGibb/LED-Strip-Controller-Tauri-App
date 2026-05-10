# Copilot Instructions

## Project Context

- This app controls custom LED strip controller hardware.
- Stack:
  - Frontend: React + TypeScript
  - Backend: Rust (Tauri)
  - Reproducible environment/builds: Nix flakes
- CI pipelines are used to keep the app validated and up to date.

## Code Guidance

- Keep changes focused and minimal; avoid unrelated refactors.
- Prefer clear, typed React/TypeScript code in `src/`.
- Keep Rust backend logic and device communication changes in `src-tauri/src/`.
- Preserve the frontend/backend contract used by Tauri command invocations.
- Maintain cross-platform compatibility for Tauri desktop/mobile targets.

## Build and Validation Expectations

- Ensure the project remains buildable in standard and Nix-based workflows.
- Do not break GitHub Actions pipelines or flake checks.
- Match existing linting/formatting conventions for both TypeScript and Rust.

## Commit and PR Conventions

- Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.
- Keep PRs scoped to a single task with a concise summary of what changed and why.
