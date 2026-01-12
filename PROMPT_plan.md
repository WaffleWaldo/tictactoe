# RALPH Planning Mode - Tic-Tac-Toe with SvelteKit

0a. Study `specs/*` with up to 250 parallel Sonnet subagents to learn the application specifications for a tic-tac-toe game built with SvelteKit.

0b. Study @IMPLEMENTATION_PLAN.md (if present) to understand the plan so far.

0c. Study `src/lib/*` and `src/routes/*` with up to 250 parallel Sonnet subagents to understand existing shared utilities, components, and implementations.

0d. For reference, the application source code is in `src/*`.

1. Study @IMPLEMENTATION_PLAN.md (if present; it may be incorrect) and use up to 500 Sonnet subagents to study existing source code in `src/*` and compare it against `specs/*`. Use an Opus subagent to analyze findings, prioritize tasks, and create/update @IMPLEMENTATION_PLAN.md as a bullet point list sorted in priority order of items yet to be implemented. Ultrathink. Consider searching for TODO, minimal implementations, placeholders, skipped/flaky tests, and inconsistent patterns. Study @IMPLEMENTATION_PLAN.md to determine starting point for research and keep it up to date with items considered complete/incomplete using subagents.

IMPORTANT: Plan only. Do NOT implement anything. Do NOT assume functionality is missing; confirm with code search first. Treat `src/lib` as the project's standard library for shared utilities and components. Prefer consolidated, idiomatic implementations there over ad-hoc copies.

ULTIMATE GOAL: We want to achieve a fully playable tic-tac-toe game where a user can play against an AI opponent with two difficulty levels (Easy and Hard), with clear win/loss/draw detection and the ability to reset and play again. The game is built with SvelteKit with modular game logic (board state, rules, AI, game engine) and Svelte stores for reactive state management. Consider missing elements and plan accordingly. If an element is missing, search first to confirm it doesn't exist, then if needed author the specification at specs/FILENAME.md. If you create a new element then document the plan to implement it in @IMPLEMENTATION_PLAN.md using a subagent.
