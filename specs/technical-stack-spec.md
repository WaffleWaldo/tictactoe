# Technical Stack & Implementation

## Purpose
Define the technology stack, project structure, development environment, and implementation guidelines for building the tic-tac-toe game with SvelteKit.

## Technology Stack

### Framework & Language
- **Runtime**: Node.js (v18+)
- **Language**: JavaScript (ES2020+)
- **Framework**: SvelteKit
- **Build Tool**: Vite (included with SvelteKit)
- **Package Manager**: npm or pnpm

### Development Tools
- **Testing Framework**: Vitest (built-in with SvelteKit)
- **Linting**: ESLint (with eslint-plugin-svelte)
- **Code Formatting**: Prettier (with prettier-plugin-svelte)
- **Type Checking**: TypeScript (optional but recommended)
- **Version Control**: Git

### SvelteKit Specifics
- **Rendering Mode**: Client-side SPA (single-page application)
- **Routing**: SvelteKit file-based routing (routes/ directory)
- **State Management**: Svelte stores (lightweight, no external dependencies)
- **Styling**: Scoped CSS or Tailwind CSS (choice of implementer)

### No External Game Libraries
- **Constraint**: Vanilla JavaScript game logic (no Chess.js, game-engine libraries, etc.)
- **Reason**: Forces clear implementation of game rules, AI, and state management
- **Allowed**: UI component libraries (Svelte components), CSS frameworks

## Project Structure

```
tictactoe-sveltekit/
├── src/
│   ├── routes/
│   │   └── +page.svelte           (main game page - UI component)
│   ├── lib/
│   │   ├── gameEngine.js          (Game Flow & Orchestration)
│   │   ├── board.js               (Board State Management)
│   │   ├── rules.js               (Game Rules & Win Conditions)
│   │   ├── ai.js                  (AI Opponent)
│   │   └── stores.js              (Svelte stores for state)
│   ├── app.html                   (HTML shell)
│   └── app.css                    (global styles)
├── tests/
│   ├── board.test.js
│   ├── rules.test.js
│   ├── ai.test.js
│   └── gameEngine.test.js
├── svelte.config.js               (SvelteKit config)
├── vite.config.js                 (Vite config)
├── package.json
├── README.md
├── .gitignore
├── PROMPT_plan.md
├── PROMPT_build.md
├── AGENTS.md
└── loop.sh
```

## Core Modules (Mapping Specs to Code)

### 1. Board State Management (`src/lib/board.js`)
**Implements**: Board State Management spec

```js
export class Board {
  constructor() {
    this.cells = Array(9).fill(null);    // [null, null, null, ...]
    this.currentPlayer = 'X';            // X or O
    this.status = 'ONGOING';             // ONGOING | PLAYER_WON | AI_WON | DRAW
    this.difficulty = 'HARD';            // EASY | HARD
  }

  initialize() { /* reset to empty */ }
  placeMove(row, col, player) { /* validate and place */ }
  getCell(row, col) { /* return cell value */ }
  getAvailableMoves() { /* return empty cells */ }
  reset() { /* clear board */ }
  isFull() { /* check if board full */ }
  switchTurn() { /* toggle X ↔ O */ }
  getStatus() { /* return current status */ }
  setStatus(status) { /* update status */ }
}
```

### 2. Game Rules & Win Conditions (`src/lib/rules.js`)
**Implements**: Game Rules & Win Conditions spec

```js
export class GameRules {
  checkWin(board, player) { /* detect 3 in a row */ }
  checkDraw(board) { /* detect full board */ }
  validateMove(board, row, col) { /* check if move legal */ }
  getWinnerMove(board, player) { /* return winning move if exists */ }
  getBlockingMove(board, opponent) { /* return move to block opponent */ }
}
```

### 3. AI Opponent (`src/lib/ai.js`)
**Implements**: AI Opponent spec

```js
export class AIOpponent {
  getMove(board, difficulty) {
    if (difficulty === 'EASY') {
      return this.getRandomMove(board);
    } else {
      return this.getMinimax Move(board);
    }
  }

  getRandomMove(board) { /* random from available */ }
  getMinimaxMove(board) { /* minimax algorithm */ }
  minimax(board, isAI, depth = 0) { /* recursive evaluation */ }
}
```

### 4. Game Flow & Orchestration (`src/lib/gameEngine.js`)
**Implements**: Game Flow & Orchestration spec

```js
export class GameEngine {
  constructor() {
    this.board = new Board();
    this.rules = new GameRules();
    this.ai = new AIOpponent();
    this.aiThinking = false;
  }

  initializeGame(difficulty) { /* setup new game */ }
  handlePlayerMove(row, col) { /* process player click */ }
  handleAIMove() { /* calculate & apply AI move */ }
  checkGameEnd() { /* detect win/draw */ }
  resetGame() { /* new game */ }
}
```

### 5. Svelte Stores (`src/lib/stores.js`)
**Reactive state for UI updates**

```js
import { writable } from 'svelte/store';

export const board = writable([...]);        // current board state
export const currentPlayer = writable('X');  // X or O
export const gameStatus = writable('ONGOING');  // game status
export const difficulty = writable('HARD');  // difficulty level
export const gameStarted = writable(false);  // has game started?
export const aiThinking = writable(false);   // is AI calculating?
```

### 6. UI Component (`src/routes/+page.svelte`)
**Implements**: UI & Interaction spec

```svelte
<script>
  import { board, currentPlayer, gameStatus, difficulty, aiThinking } from '$lib/stores';
  import { gameEngine } from '$lib/gameEngine';

  function handleCellClick(row, col) {
    if ($aiThinking || $gameStatus !== 'ONGOING') return;
    gameEngine.handlePlayerMove(row, col);
  }

  function handlePlayAgain() {
    gameEngine.resetGame();
  }

  function setDifficulty(level) {
    gameEngine.initializeGame(level);
  }
</script>

<!-- UI structure here -->
```

## What It Does (Implementation Approach)

### Game Flow (In SvelteKit Terms)
```
1. User loads page
   ↓
2. +page.svelte displays difficulty selector
   ↓
3. User selects Easy/Hard → calls setDifficulty()
   ↓
4. gameEngine.initializeGame() creates Board, Rules, AI
   ↓
5. Board state written to Svelte stores
   ↓
6. UI reactively updates (board, currentPlayer displayed)
   ↓
7. User clicks cell → handleCellClick()
   ↓
8. gameEngine.handlePlayerMove() validates & places move
   ↓
9. Board stores update → UI re-renders
   ↓
10. gameEngine checks win/draw
    ├─ If game continues → gameEngine.handleAIMove()
    │   ├─ Set aiThinking = true
    │   ├─ Calculate AI move (minimax)
    │   ├─ Place AI move on board
    │   ├─ Set aiThinking = false
    │   └─ Board stores update → UI re-renders
    │
    └─ If game ends → show end-game screen
```

### State Management Strategy
- **Persistent State** (game state): Svelte stores (board, currentPlayer, gameStatus)
- **Transient State** (UI state): Component local state (aiThinking, selectedDifficulty)
- **Logic** (game engine): Separate modules (gameEngine, rules, ai, board)
- **Why**: Clean separation, easy to test, reactive UI

## Acceptance Criteria

### Project Setup
- [ ] SvelteKit project initializes with `npm create vite@latest -- --template svelte`
- [ ] package.json includes SvelteKit, Vitest, ESLint, Prettier
- [ ] vite.config.js configures SvelteKit correctly
- [ ] svelte.config.js exists with basic config
- [ ] Project builds without errors: `npm run build`

### Development Environment
- [ ] Dev server runs: `npm run dev`
- [ ] Page loads at http://localhost:5173 (default SvelteKit port)
- [ ] HMR (hot module replacement) works during development
- [ ] No console errors or warnings

### Game Logic Implementation
- [ ] Board, Rules, AI modules work independently (testable in isolation)
- [ ] gameEngine orchestrates all modules
- [ ] No external game libraries used (vanilla logic)
- [ ] All game state in stores or gameEngine (single source of truth)

### UI Integration
- [ ] +page.svelte displays board, difficulty selector, status
- [ ] Difficulty selector works before game starts
- [ ] Board updates reactively when stores change
- [ ] Cell clicks call handlePlayerMove → stores update → UI re-renders
- [ ] End-game screen appears on win/loss/draw
- [ ] Play Again button works

### Testing
- [ ] Tests exist for board.js (initialization, moves, reset)
- [ ] Tests exist for rules.js (win detection, validation)
- [ ] Tests exist for ai.js (random moves, minimax)
- [ ] Tests exist for gameEngine.js (turn management, state flow)
- [ ] Run tests: `npm run test`
- [ ] All tests pass

### Build & Deployment
- [ ] Production build: `npm run build` creates optimized output
- [ ] Build artifacts in build/ folder
- [ ] No build errors or warnings
- [ ] Can preview production build: `npm run preview`

## Key Implementation Guidelines

### 1. Module Separation
- Each spec file has corresponding .js module
- Modules export classes or functions (not default exports where possible)
- Minimal dependencies between modules (gameEngine coordinates)
- Easy to test in isolation

### 2. Svelte Stores for State
- Use `writable()` for reactive state
- Subscribe to stores in components (auto-updates on change)
- Avoid prop drilling (use stores instead)
- Keep stores simple (don't add methods, just data)

### 3. No Browser Storage
- ⚠️ Don't use localStorage, sessionStorage, IndexedDB, cookies
- ⚠️ RALPH sandbox doesn't allow them (SecurityError)
- Use stores only (state lost on page refresh, which is fine)

### 4. Async AI Move
- AI calculation should be async (feels more natural)
- Use setTimeout or Promise to delay slightly (100-300ms)
- Set aiThinking = true during calculation
- Disable clicks while aiThinking = true

### 5. Testing Strategy
- Use Vitest (built-in with SvelteKit)
- Test game logic (board, rules, ai) without Svelte
- Test component behavior separately (optional for RALPH)
- Run tests: `npm run test`

## Example: Minimal Component

```svelte
<script>
  import { board, currentPlayer, aiThinking } from '$lib/stores';

  let selectedCell = null;

  async function handleClick(index) {
    if ($aiThinking) return;
    const row = Math.floor(index / 3);
    const col = index % 3;
    await gameEngine.handlePlayerMove(row, col);
  }
</script>

<div class="board">
  {#each $board as cell, index}
    <button 
      on:click={() => handleClick(index)}
      disabled={$aiThinking}
    >
      {cell}
    </button>
  {/each}
</div>
```

## Performance Considerations
- AI minimax should complete within 500ms (even with 5+ empty cells)
- SvelteKit HMR makes development fast
- No performance concerns for 3x3 board (9 cells, ~5000 game states max)
- Consider alpha-beta pruning if minimax is slow

## Deployment Options
- **Vercel** (native SvelteKit support)
- **Netlify** (works with SvelteKit)
- **Docker** (containerize for any host)
- For this project: Static HTML output or simple Node server

## File Checklist

After implementation, you should have:
```
src/
├── routes/
│   ├── +page.svelte ✓
│   └── +page.css ✓
├── lib/
│   ├── board.js ✓
│   ├── rules.js ✓
│   ├── ai.js ✓
│   ├── gameEngine.js ✓
│   └── stores.js ✓
└── app.html ✓

tests/
├── board.test.js ✓
├── rules.test.js ✓
├── ai.test.js ✓
└── gameEngine.test.js ✓

Configuration:
├── package.json ✓
├── svelte.config.js ✓
├── vite.config.js ✓
├── vitest.config.js ✓ (if separate from vite.config.js)
└── .eslintrc.json ✓
```

## Scripts (package.json)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "lint": "eslint src",
    "format": "prettier --write ."
  }
}
```

## Implementation Notes
- Start with game logic (board.js, rules.js, ai.js) - test independently
- Then build gameEngine.js to orchestrate
- Finally, build +page.svelte UI component
- Use Svelte stores to connect gameEngine and UI
- Keep components simple (just display + event handlers)
- Game logic handles all complexity

## Why SvelteKit?
- ✅ Modern, reactive framework (Svelte is simpler than React)
- ✅ Built-in routing, stores, testing (minimal setup)
- ✅ Fast development (HMR, small bundle size)
- ✅ TypeScript optional (flexible for RALPH)
- ✅ Single-file components (easy to understand)
- ✅ Vite (fast build tool)

## Potential Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| **Minimax is slow** | Use alpha-beta pruning; optimize board representation |
| **State gets out of sync** | Use stores as single source of truth; test state flow |
| **Component re-renders too much** | Use store subscriptions instead of props |
| **Testing game logic** | Test board.js, rules.js, ai.js independently (no Svelte) |
| **Browser refresh loses state** | Expected behavior (no persistence required) |
