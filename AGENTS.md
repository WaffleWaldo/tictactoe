# AGENTS - SvelteKit Tic-Tac-Toe

## Build & Run

**Project**: Tic-tac-toe game with SvelteKit + JavaScript game logic

### Setup
- **Node version**: v18+ required
- **Package manager**: npm or pnpm
- **First time**: `npm install` to install dependencies

### Development
- **Dev server**: `npm run dev`
- **URL**: http://localhost:5173 (default SvelteKit port)
- **HMR**: Hot module replacement enabled (changes reflect instantly)
- **Stop**: Ctrl+C to stop dev server

### Build
- **Production build**: `npm run build`
- **Output folder**: `build/` (or `.svelte-kit/build` internally)
- **Preview**: `npm run preview` (preview production build locally)

---

## Validation

Run these AFTER implementing a feature to get immediate feedback:

### Tests
```bash
npm run test
```
- Runs all tests in `tests/` folder
- Uses Vitest
- Stop on first failure: `npm run test -- --reporter=verbose`
- Watch mode (re-run on file change): `npm run test -- --watch`

### Test Individual Files
```bash
npm run test -- tests/board.test.js
npm run test -- tests/rules.test.js
npm run test -- tests/ai.test.js
npm run test -- tests/gameEngine.test.js
```

### Lint & Format
```bash
npm run lint       # ESLint check
npm run format     # Prettier format (if configured)
```

### Build Check
```bash
npm run build
```
- Fails if there are build errors
- Creates optimized production bundle
- Check for warnings in output

---

## Codebase Patterns

### Module Organization
All game logic is in `src/lib/`:
- **board.js** - Board class (state management, move placement, reset)
- **rules.js** - GameRules class (win detection, move validation)
- **ai.js** - AIOpponent class (Easy: random, Hard: minimax)
- **gameEngine.js** - GameEngine class (orchestrates all modules, manages flow)
- **stores.js** - Svelte stores (reactive state for UI: board, currentPlayer, gameStatus, difficulty, aiThinking, gameStarted)

### UI Component
- **src/routes/+page.svelte** - Main game component (displays board, handles clicks, shows UI)
- Uses stores to access/update game state
- Calls gameEngine methods for game logic

### Testing Pattern
- Each module has corresponding test file: `tests/MODULE.test.js`
- Tests use Vitest (Jest-like syntax)
- Test game logic WITHOUT Svelte (import classes directly)
- Example: `import { Board } from '../src/lib/board.js'`

### Svelte Stores (Reactive State)
```js
import { writable } from 'svelte/store';
export const board = writable([...]);           // 9-cell array
export const currentPlayer = writable('X');     // X or O
export const gameStatus = writable('ONGOING');  // ONGOING | PLAYER_WON | AI_WON | DRAW
export const difficulty = writable('HARD');     // EASY or HARD
export const gameStarted = writable(false);     // Has game started?
export const aiThinking = writable(false);      // Is AI calculating?
```

---

## Implementation Notes

### Game Flow
1. User selects difficulty → `gameEngine.initializeGame(difficulty)`
2. User clicks cell → `gameEngine.handlePlayerMove(row, col)`
3. gameEngine calls `board.placeMove()`, `rules.checkWin()`, updates stores
4. If game continues → `gameEngine.handleAIMove()` (async)
5. AI calculates move → updates board → checks win → updates stores
6. UI reactively updates from stores

### No Browser Storage
- ❌ Don't use `localStorage`, `sessionStorage`, `IndexedDB`, cookies
- ✅ Use stores only (state lost on page refresh, expected)
- Reason: RALPH sandbox throws SecurityError on storage APIs

### AI Move Timing
- Easy: instant (random from available cells)
- Hard: <500ms (minimax algorithm, possibly with alpha-beta pruning)
- Add 100-300ms delay for natural feel (use setTimeout)
- Set `aiThinking = true` during calculation, `false` when done

### Board Representation
- Internal: 1D array of 9 elements (indices 0-8)
- Cell states: 'X', 'O', or null (empty)
- Coordinate conversion:
  - (row, col) → index: `row * 3 + col`
  - index → (row, col): `row = Math.floor(index/3), col = index%3`

---

## Operational Notes

### Dependency Management
- SvelteKit includes: Vite, Vitest, routing, stores
- No extra game libraries (vanilla JS)
- CSS framework optional (Tailwind, CSS Modules, scoped CSS all work)

### Git Workflow
- Each task = 1 commit
- Commit message format: "Implement [feature]: [description]"
- Example: "Implement Board State: initialize empty 3x3 grid with move validation"
- Tag releases: 0.0.1, 0.0.2, etc.

### Debugging
- Browser DevTools: F12 (inspect stores, network, console)
- Terminal: check `npm run dev` output for errors
- Add console.log for debugging (remove before final commit)
- Check test output: `npm run test` shows which tests fail

### Common Issues

| Problem | Solution |
|---------|----------|
| "Module not found" | Check import paths (use `$lib` alias for `src/lib`) |
| Tests fail | Run `npm run test -- --reporter=verbose` for details |
| Dev server won't start | Kill process on port 5173: `lsof -ti:5173 \| xargs kill` |
| Store not updating UI | Check: is component subscribed? Use `$store` in Svelte |
| AI move is instant | Add `setTimeout` delay (100-300ms) for natural feel |
| Minimax is slow | Use alpha-beta pruning or limit search depth |

---

## SvelteKit Specific

### File Structure
- **src/routes/**: File-based routing (each .svelte file = route)
- **+page.svelte**: Root route (http://localhost:5173/)
- **src/lib/**: Shared code (utilities, stores, classes)
- **$lib**: Alias for `src/lib` (use in imports: `import { Board } from '$lib/board'`)

### Svelte Syntax Essentials
```svelte
<!-- Reactive binding -->
<div>{$store}</div>

<!-- Click handler -->
<button on:click={() => handleClick()}>Click</button>

<!-- Loop -->
{#each items as item}
  <p>{item}</p>
{/each}

<!-- Conditional -->
{#if condition}
  <p>Shown</p>
{:else}
  <p>Hidden</p>
{/if}

<!-- Two-way binding -->
<input bind:value={localVar} />
```

### Store Subscription
```js
import { board } from '$lib/stores';

// In Svelte component:
{$board}  // Auto-subscribes, updates when store changes

// In JS file:
board.subscribe(value => console.log(value));
```

---

## Commands Quick Reference

```bash
# Development
npm install          # Install dependencies (first time)
npm run dev          # Start dev server
npm run test         # Run all tests
npm run test -- --watch  # Watch mode

# Production
npm run build        # Production build
npm run preview      # Preview production build

# Maintenance
npm run lint         # Check code style
npm run format       # Format code
npm update           # Update dependencies
```

---

## Success Criteria

After each implementation task:
- ✅ Code builds without errors (`npm run build`)
- ✅ Dev server runs without warnings (`npm run dev`)
- ✅ All tests pass (`npm run test`)
- ✅ Feature works as specified in specs/*.md
- ✅ Changes committed with descriptive message
- ✅ No TODOs or placeholders in code
