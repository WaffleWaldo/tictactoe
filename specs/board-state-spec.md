# Board State Management

## Purpose
Maintain the current state of the game board, track game status, and provide operations to query and modify board state safely.

## What It Does
- Initialize empty 3x3 board (9 cells)
- Store cell values (X, O, or empty)
- Track current game status (ongoing, player won, AI won, draw)
- Track whose turn it is (player or AI)
- Provide methods to check if a cell is occupied
- Provide methods to check available moves
- Provide methods to get full board state
- Provide methods to place a move on the board (with validation)
- Provide methods to reset the board to empty state
- Maintain immutability (copies of board state, not references)

## What It Does (Detailed)

### Board Representation
- 3x3 grid stored internally (could be array, 2D array, or flat array)
- Each cell contains: 'X', 'O', or null/empty
- Board can be accessed via coordinates (row, col) or flat index (0-8)
- Coordinate system: rows 0-2 (top to bottom), cols 0-2 (left to right)

### Board Operations
- `initialize()` - Create new empty board
- `getCell(row, col)` - Return cell contents ('X', 'O', or empty)
- `getCellByIndex(index)` - Return cell contents by flat index (0-8)
- `getBoard()` - Return copy of entire board state (immutable)
- `getAvailableMoves()` - Return list of empty cell positions
- `isEmpty(row, col)` - Check if cell is empty
- `isOccupied(row, col)` - Check if cell contains X or O
- `isValid(row, col)` - Check if coordinates are within 3x3 bounds
- `placeMove(row, col, player)` - Place X or O on board (returns success/failure)
- `reset()` - Clear all cells back to empty
- `isFull()` - Check if all 9 cells are occupied

### Game Status Tracking
- Status values: ONGOING, PLAYER_WON, AI_WON, DRAW
- `getStatus()` - Return current game status
- `setStatus(status)` - Update game status
- `isGameOver()` - Check if game is in ended state
- `getCurrentPlayer()` - Return X or O (whose turn)
- `switchTurn()` - Alternate between X and O
- `getPlayerSymbol()` - Return 'X' (player is always X)
- `getAISymbol()` - Return 'O' (AI is always O)

## Acceptance Criteria

### Initialization
- [ ] New board contains 9 empty cells
- [ ] Board starts as Player (X) turn
- [ ] Board status starts as ONGOING
- [ ] All cells read as empty initially

### State Access
- [ ] Can read any cell by coordinates (row, col)
- [ ] Can read any cell by flat index (0-8)
- [ ] Can get list of available moves
- [ ] Can check if specific cell is empty
- [ ] Can check if specific cell is occupied
- [ ] Can get full board state

### Move Placement
- [ ] Place move on empty cell succeeds
- [ ] Place move on occupied cell fails (rejects without modifying board)
- [ ] Place move outside bounds fails (rejects)
- [ ] Place move returns success/failure indicator
- [ ] After successful move, cell contains correct symbol (X or O)
- [ ] After failed move, board unchanged

### Turn Management
- [ ] Can switch turns (X to O, O to X)
- [ ] getCurrentPlayer returns correct player after switch
- [ ] Turn switches only when requested
- [ ] Turn state persists across board queries

### Status Management
- [ ] Can set status to ONGOING
- [ ] Can set status to PLAYER_WON
- [ ] Can set status to AI_WON
- [ ] Can set status to DRAW
- [ ] isGameOver returns true for any ended status
- [ ] isGameOver returns false for ONGOING

### Reset
- [ ] Reset clears all cells to empty
- [ ] Reset sets status back to ONGOING
- [ ] Reset sets turn back to Player (X)
- [ ] Reset allows new game to start

### Immutability
- [ ] Returned board states are copies (modifying returned state doesn't affect internal state)
- [ ] Returned move lists are copies
- [ ] Internal state is protected from external modification
- [ ] No unintended side effects from queries

## Edge Cases
- Attempt to place move at coordinates outside 0-2 range
- Attempt to place move on already-occupied cell
- Attempt to place move before board is initialized
- Request available moves when board is full
- Request available moves when board is empty (should return all 9)
- Multiple resets in sequence
- Status changes mid-game
- Turn switching multiple times in succession
- Reading cell that doesn't exist (out of bounds)
- Flat index out of range (>8 or <0)

## Board Coordinate Systems

### Coordinate System (Row, Col)
```
(0,0) | (0,1) | (0,2)
------|-------|------
(1,0) | (1,1) | (1,2)
------|-------|------
(2,0) | (2,1) | (2,2)
```

### Flat Index System (0-8)
```
0 | 1 | 2
--|---|--
3 | 4 | 5
--|---|--
6 | 7 | 8
```

Conversion:
- (row, col) → index: `row * 3 + col`
- index → (row, col): `row = index / 3`, `col = index % 3`

## Implementation Notes
- Consider using 1D array (9 elements) vs 2D array (3x3) for storage (both valid)
- Provide helper methods for coordinate/index conversion
- Use consistent internal representation to avoid confusion
- Always return copies of board state (not references) to prevent external modifications
- Consider freezing returned objects (Object.freeze in JS) for true immutability
- Test boundary conditions thoroughly (edge cells, center, out of bounds)

## Example Usage

```js
const board = new Board();

// Initialize
board.initialize();  // Board is now empty, X's turn, status ONGOING

// Query
board.getCell(0, 0);           // null (empty)
board.getAvailableMoves();     // [all 9 cells]
board.isEmpty(0, 0);           // true
board.isValid(3, 0);           // false (out of bounds)

// Place moves
board.placeMove(0, 0, 'X');    // Success: cell now contains X
board.placeMove(0, 0, 'O');    // Failure: cell already occupied
board.isOccupied(0, 0);        // true

// Turn management
board.switchTurn();            // Now O's turn
board.getCurrentPlayer();      // 'O'

// Status
board.setStatus('PLAYER_WON');
board.getStatus();             // 'PLAYER_WON'
board.isGameOver();            // true

// Reset
board.reset();                 // Clear board, status ONGOING, X's turn
```
