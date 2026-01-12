# Implementation Plan - Tic-Tac-Toe with SvelteKit

## Status Summary
- **Project State**: Fully implemented - all modules, UI, and tests complete
- **Last Updated**: 2026-01-12
- **Implementation Complete**:
  - Priority 1: Project Setup - COMPLETED (9/9 tasks)
  - Priority 2: Core Game Logic - COMPLETED (board.js, rules.js, ai.js)
  - Priority 3: State Management - COMPLETED (stores.js with 7 stores)
  - Priority 4: Game Engine - COMPLETED (gameEngine.js)
  - Priority 5: UI Component - COMPLETED (+page.svelte)
  - Priority 6: Tests - COMPLETED (116 tests passing: 36 board + 34 rules + 22 ai + 24 gameEngine)
- **Test Coverage**: 116/116 tests passing across all modules
- **Build Status**: Production build passing
- **Next Action**: Priority 7 - Polish & Verification (manual testing and final validation)

## Critical Implementation Notes (from spec analysis)
1. **No browser storage** - localStorage/sessionStorage/IndexedDB cause SecurityError in RALPH sandbox
2. **Player always X, AI always O** - Player moves first on odd turns (1,3,5,7,9), AI on even (2,4,6,8)
3. **Minimax scoring** - AI win: +10, Draw: 0, Player win: -10 (subtract depth for faster wins)
4. **AI delay** - Add 100-300ms delay for natural UX feel (use setTimeout/Promise)
5. **Alpha-beta pruning** - Strongly recommended for Hard mode performance (<500ms)
6. **Immutability** - Return copies of board state with spread operator or Object.freeze
7. **Game status values** - Use strings: 'ONGOING', 'PLAYER_WON', 'AI_WON', 'DRAW'

## Implementation Order & Dependencies

```
Priority 1: Project Setup ─────────────────────────────────────────────────────┐
    │                                                                          │
    ├─► Priority 2: Core Game Logic (can be done in parallel)                  │
    │       ├── board.js (no dependencies)                                     │
    │       ├── rules.js (no dependencies)                                     │
    │       └── ai.js (depends on rules.js for win detection)                  │
    │                                                                          │
    ├─► Priority 3: stores.js (depends on board structure)                     │
    │                                                                          │
    ├─► Priority 4: gameEngine.js (depends on board, rules, ai, stores)        │
    │                                                                          │
    ├─► Priority 5: +page.svelte (depends on gameEngine, stores)               │
    │                                                                          │
    ├─► Priority 6: Tests (can be written alongside each module)               │
    │                                                                          │
    └─► Priority 7: Polish & Verification                                      │
```

---

## Priority 1: Project Setup (Foundation) - COMPLETED

- [x] **Initialize SvelteKit project** - Run `npm create svelte@latest .` in project directory (select Skeleton project, JavaScript, no TypeScript)
- [x] **Install dependencies** - Run `npm install` to install all SvelteKit dependencies
- [x] **Configure package.json** - Ensure scripts for dev, build, test, preview are present
- [x] **Install and configure Vitest** - `npm install -D vitest` and create vitest.config.js for testing game logic modules
- [x] **Configure ESLint** - Install eslint-plugin-svelte and configure for Svelte files
- [x] **Configure Prettier** - Install prettier-plugin-svelte and configure for consistent formatting
- [x] **Create directory structure** - Ensure `src/lib/` and `src/routes/` directories exist with proper structure
- [x] **Create tests directory** - Create `tests/` directory at project root for test files
- [x] **Verify dev server works** - Run `npm run dev` and confirm page loads at localhost:5173

---

## Priority 2: Core Game Logic (Independent Modules) - COMPLETED

### Board State Management (`src/lib/board.js`) - COMPLETED
Implements: `specs/board-state-spec.md`

- [x] **Create Board class with cell storage** - 9-element array initialized to null, representing 3x3 grid
- [x] **Implement initialize method** - Reset board to empty state, set turn to X, status to ONGOING
- [x] **Implement coordinate system** - Support (row, col) coordinates and flat index (0-8) conversion
- [x] **Implement coordinate conversion helpers** - `toIndex(row, col)` returns `row * 3 + col`; `toCoords(index)` returns `{row: Math.floor(index/3), col: index % 3}`
- [x] **Implement getCell/getCellByIndex** - Return cell contents by coordinates or flat index
- [x] **Implement getAvailableMoves** - Return list of empty cell positions
- [x] **Implement isEmpty/isOccupied/isValid** - Cell query methods for validation
- [x] **Implement placeMove** - Place X or O on board with validation, return success/failure
- [x] **Implement turn management** - getCurrentPlayer, switchTurn, getPlayerSymbol ('X'), getAISymbol ('O')
- [x] **Implement status management** - getStatus, setStatus, isGameOver for ONGOING/PLAYER_WON/AI_WON/DRAW
- [x] **Implement reset** - Clear board, reset to ONGOING status, reset turn to X
- [x] **Implement getBoard** - Return immutable copy of board state (use spread operator or Object.freeze)
- [x] **Implement isFull** - Check if all 9 cells are occupied

### Game Rules (`src/lib/rules.js`) - COMPLETED
Implements: `specs/game-rules-winconditons-spec.md`

- [x] **Export WIN_COMBINATIONS constant** - Array of 8 winning line index arrays: rows `[[0,1,2], [3,4,5], [6,7,8]]`, columns `[[0,3,6], [1,4,7], [2,5,8]]`, diagonals `[[0,4,8], [2,4,6]]`
- [x] **Implement checkWin** - Detect if specified player has 3 in a row, return winning combination array or null
- [x] **Implement checkDraw** - Detect if board is full with no winner (returns boolean)
- [x] **Implement validateMove** - Check if move is legal (within bounds 0-2, cell empty, game ongoing), returns boolean
- [x] **Implement getWinningMove** - Return cell index that would win for specified player, or null if none (used by AI for winning/blocking)
- [x] **Implement getGameResult** - Return current game outcome string: 'ONGOING', 'PLAYER_WON', 'AI_WON', or 'DRAW'

### AI Opponent (`src/lib/ai.js`) - COMPLETED
Implements: `specs/ai-opponent-spec.md`

- [x] **Implement getRandomMove** - Select random cell from available moves (Easy mode, must complete <10ms)
- [x] **Implement minimax algorithm** - Recursive evaluation of all game states with scoring (+10 AI win, 0 draw, -10 player win, adjust by depth for faster wins)
- [x] **Implement getMinimaxMove** - Use minimax to find optimal move (Hard mode, must complete <500ms)
- [x] **Implement getMove dispatcher** - Route to random or minimax based on difficulty parameter ('EASY' or 'HARD')
- [x] **Implement alpha-beta pruning** - Optimize minimax to prune branches where alpha >= beta (strongly recommended for performance)

---

## Priority 3: State Management (`src/lib/stores.js`) - COMPLETED

- [x] **Create board store** - writable store for current board array (9 cells, initialized to Array(9).fill(null))
- [x] **Create currentPlayer store** - writable store for whose turn ('X' or 'O', initialized to 'X')
- [x] **Create gameStatus store** - writable store for game state ('ONGOING', 'PLAYER_WON', 'AI_WON', 'DRAW', initialized to 'ONGOING')
- [x] **Create difficulty store** - writable store for difficulty level ('EASY' or 'HARD', initialized to 'HARD')
- [x] **Create gameStarted store** - writable store for whether game has started (boolean, initialized to false)
- [x] **Create aiThinking store** - writable store for AI calculation state (boolean, initialized to false)
- [x] **Create winningCombination store** - writable store for highlighted winning cells (array of indices or null)

---

## Priority 4: Game Engine (`src/lib/gameEngine.js`) - COMPLETED
Implements: `specs/game-flow-spec.md`

- [x] **Create GameEngine class** - Orchestrates Board, GameRules, AIOpponent instances
- [x] **Implement initializeGame** - Create new game with selected difficulty, update stores, set gameStarted to true
- [x] **Implement handlePlayerMove** - Validate move, place on board, check win/draw, trigger AI turn if game continues
- [x] **Implement handleAIMove** - Calculate AI move based on difficulty, apply with 100-300ms delay for natural UX feel
- [x] **Implement checkGameEnd** - Check for win/draw after each move, update status store and winningCombination store
- [x] **Implement resetGame** - Reset all state, update stores, ready for new game (preserve difficulty selection)
- [x] **Implement store synchronization** - Keep Svelte stores in sync with internal game state after every operation
- [x] **Implement UI locking** - Set aiThinking store to true before AI calculation, false after move applied
- [x] **Implement difficulty change prevention** - Only allow difficulty changes when gameStarted is false
- [x] **Export singleton gameEngine** - Single instance for use in UI component

---

## Priority 5: UI Component (`src/routes/+page.svelte` and `src/routes/+page.css`) - COMPLETED
Implements: `specs/ui-interaction-spec.md`

- [x] **Create page structure** - Title, difficulty selector, board grid, status area, play again button
- [x] **Implement difficulty selector** - Radio buttons or toggle buttons for Easy/Hard selection (disabled after game starts)
- [x] **Implement 3x3 board grid** - CSS Grid with `grid-template-columns: repeat(3, 1fr)` and 9 clickable button cells
- [x] **Implement cell click handler** - Call gameEngine.handlePlayerMove with row/col coordinates calculated from index
- [x] **Implement reactive board display** - Subscribe to board store using `$board`, show X/O/empty in cells
- [x] **Implement turn indicator** - Show "Your turn (X)" or "AI thinking (O)" based on currentPlayer and aiThinking stores
- [x] **Implement difficulty display** - Show selected difficulty level prominently
- [x] **Implement game end overlay** - Modal/overlay showing "Player Wins!", "AI Wins!", or "It's a Draw!" based on gameStatus
- [x] **Implement winning line highlight** - Highlight winning cells using winningCombination store
- [x] **Implement Play Again button** - Call gameEngine.resetGame, visible after game ends or always present
- [x] **Implement click prevention** - Check `$aiThinking || $gameStatus !== 'ONGOING'` before processing clicks
- [x] **Add hover/click feedback** - CSS hover states for empty cells only, cursor changes
- [x] **Create +page.css** - Scoped styles with CSS Grid layout, clean modern appearance, high contrast (WCAG AA)
- [x] **Ensure responsive design** - Works on desktop and mobile viewports

---

## Priority 6: Tests - COMPLETED (116/116 tests passing)

### Board Tests (`tests/board.test.js`) - COMPLETED (36 tests passing)
- [x] **Test initialization** - Empty board (9 nulls), X turn, ONGOING status
- [x] **Test placeMove success** - Valid move places correct symbol, returns true
- [x] **Test placeMove failure** - Occupied cell or out of bounds rejected, returns false
- [x] **Test getAvailableMoves** - Correct empty cell indices returned
- [x] **Test getCell/getCellByIndex** - Returns correct cell content
- [x] **Test coordinate conversion** - toIndex and toCoords work correctly
- [x] **Test switchTurn** - Turn alternates X to O and back
- [x] **Test reset** - Board clears, status ONGOING, turn X
- [x] **Test immutability** - getBoard returns copy, not reference

### Rules Tests (`tests/rules.test.js`) - COMPLETED (34 tests passing)
- [x] **Test WIN_COMBINATIONS** - Contains exactly 8 winning patterns
- [x] **Test checkWin rows** - Detect 3 in a row horizontally (indices 0,1,2 or 3,4,5 or 6,7,8)
- [x] **Test checkWin columns** - Detect 3 in a row vertically (indices 0,3,6 or 1,4,7 or 2,5,8)
- [x] **Test checkWin diagonals** - Detect 3 in a row diagonally (indices 0,4,8 or 2,4,6)
- [x] **Test checkWin returns null** - No win when conditions not met
- [x] **Test checkDraw** - Detect full board with no winner returns true
- [x] **Test checkDraw false** - Not a draw when cells empty or winner exists
- [x] **Test validateMove** - Reject out of bounds, occupied cells; accept valid moves
- [x] **Test getWinningMove** - Returns correct winning cell index or null
- [x] **Test getGameResult** - Returns correct status string for all scenarios

### AI Tests (`tests/ai.test.js`) - COMPLETED (22 tests passing)
- [x] **Test getRandomMove** - Returns valid index from available moves
- [x] **Test getRandomMove distribution** - Multiple calls return different moves (probabilistic)
- [x] **Test minimax win** - AI takes immediate winning move when available
- [x] **Test minimax block** - AI blocks player's winning move when can't win
- [x] **Test minimax optimal** - AI never loses with perfect play (test known positions)
- [x] **Test getMove dispatcher** - Routes correctly based on 'EASY' vs 'HARD' difficulty
- [x] **Test performance** - Hard mode completes within 500ms on empty board

### GameEngine Tests (`tests/gameEngine.test.js`) - COMPLETED (24 tests passing)
- [x] **Test initializeGame** - Fresh game state created, stores updated
- [x] **Test handlePlayerMove valid** - Move applied, turn switches, stores synced
- [x] **Test handlePlayerMove invalid** - Invalid move rejected, state unchanged
- [x] **Test handleAIMove** - AI move calculated and applied after delay
- [x] **Test checkGameEnd win** - Player win detected, status updated
- [x] **Test checkGameEnd draw** - Draw detected when board full
- [x] **Test resetGame** - All state cleared, ready for new game
- [x] **Test difficulty change prevention** - Cannot change difficulty mid-game

---

## Priority 7: Polish & Verification

- [ ] **Run full test suite** - `npm run test` passes all tests
- [ ] **Run linter** - `npm run lint` passes with no errors
- [ ] **Run formatter** - `npm run format` applies consistent formatting
- [ ] **Build production** - `npm run build` completes without errors
- [ ] **Preview production build** - `npm run preview` and manually verify
- [ ] **Manual playthrough Easy mode** - Verify player can win consistently
- [ ] **Manual playthrough Hard mode** - Verify AI plays optimally (always draws or wins against perfect play)
- [ ] **Verify game flow** - All state transitions work correctly (start, play, win/draw, reset)
- [ ] **Verify difficulty selection** - Can select before game, cannot change mid-game
- [ ] **Verify AI delay** - AI move has noticeable but brief delay (100-300ms)
- [ ] **Verify UI locking** - Cannot click during AI turn or after game ends
- [ ] **Verify winning line highlight** - Winning combination is visually highlighted
- [ ] **Verify UI responsiveness** - Works on desktop and mobile viewport sizes
- [ ] **Verify accessibility** - High contrast, keyboard navigation works

---

## Specifications Reference

| Component | Spec File | Implementation File |
|-----------|-----------|---------------------|
| Board State | `specs/board-state-spec.md` | `src/lib/board.js` |
| Game Rules | `specs/game-rules-winconditons-spec.md` | `src/lib/rules.js` |
| AI Opponent | `specs/ai-opponent-spec.md` | `src/lib/ai.js` |
| Game Flow | `specs/game-flow-spec.md` | `src/lib/gameEngine.js` |
| UI & Interaction | `specs/ui-interaction-spec.md` | `src/routes/+page.svelte` |
| Technical Stack | `specs/technical-stack-spec.md` | Project configuration |

---

## Notes

- **No browser storage**: Per spec, do not use localStorage/sessionStorage/IndexedDB (RALPH sandbox restriction - causes SecurityError)
- **Svelte stores**: Use for reactive state management, keep simple (data only, no methods)
- **AI delay**: Add 100-300ms delay during AI move for natural feel (use setTimeout or Promise)
- **Immutability**: Return copies of board state, not references (use spread operator `[...array]` or `Object.freeze`)
- **Performance**: Easy mode <10ms, Hard mode <500ms (alpha-beta pruning strongly recommended)
- **Player symbols**: Player is always 'X' (goes first), AI is always 'O' (goes second)
- **Game status values**: 'ONGOING', 'PLAYER_WON', 'AI_WON', 'DRAW' (use string constants)
- **Coordinate system**: (row, col) where row 0-2 top-to-bottom, col 0-2 left-to-right; flat index 0-8 left-to-right, top-to-bottom
- **Win combinations**: 8 total - 3 rows, 3 columns, 2 diagonals (see rules.js for exact indices)
- **Minimax scoring**: +10 AI win, 0 draw, -10 player win (subtract depth for faster wins)
