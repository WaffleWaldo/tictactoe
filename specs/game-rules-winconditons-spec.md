# Game Rules & Win Conditions

## Purpose
Define the rules of tic-tac-toe, detect win/loss/draw conditions, and enforce legal play.

## What It Does
- Enforce standard tic-tac-toe rules on a 3x3 board
- Detect when a player (X or O) gets 3 in a row (horizontally, vertically, or diagonally)
- Detect when the board is full with no winner (draw)
- Track whose turn it is (X always starts first)
- Validate that moves are legal (cell unoccupied, within bounds)
- Declare game winner or draw when conditions are met
- Prevent moves after game ends

## Win Conditions (One of These Ends the Game)

### Player (X) Wins
- 3 X marks in the same row (any row: top, middle, bottom)
- 3 X marks in the same column (any column: left, center, right)
- 3 X marks in the same diagonal (top-left to bottom-right OR top-right to bottom-left)

### AI (O) Wins
- 3 O marks in the same row (any row: top, middle, bottom)
- 3 O marks in the same column (any column: left, center, right)
- 3 O marks in the same diagonal (top-left to bottom-right OR top-right to bottom-left)

### Draw (Tie)
- All 9 cells are occupied AND no player has 3 in a row
- Game is unwinnable for both players

## Rules

### Game Setup
- Board starts empty (all 9 cells unoccupied)
- Player is always X (starts first)
- AI is always O (goes second)
- Player makes first move

### Turn Order
- Player (X) moves first
- AI (O) moves second
- Turns alternate: X, O, X, O, X, O, X, O, X
- Maximum 9 moves total (9 cells on board)
- No player can move twice in a row
- No player can move after game ends

### Move Legality
- A move is valid only if the target cell is empty (unoccupied)
- A move is valid only if the target cell is within the 3x3 board (coordinates 0-2)
- A move is invalid if the cell is already occupied by X or O
- Invalid moves must be rejected (not applied to board)
- No move can be made after game ends (win/loss/draw detected)

### Game End Conditions
- Game ends immediately when a player gets 3 in a row
- Game ends immediately when all 9 cells are filled with no winner (draw)
- No further moves allowed after game ends
- Game must be explicitly reset to play again

## Acceptance Criteria

### Win Detection
- [ ] Detect player wins: 3 X in row, column, or diagonal
- [ ] Detect AI wins: 3 O in row, column, or diagonal
- [ ] Game ends immediately when win is detected
- [ ] All 8 possible winning combinations detected (3 rows, 3 columns, 2 diagonals)
- [ ] Win detected even on move 5 (earliest possible for X), move 6 (for O)
- [ ] No false positives (detects only exactly 3 in a row, not fewer)

### Draw Detection
- [ ] Detect draw when all 9 cells filled with no winner
- [ ] Game ends immediately when board is full
- [ ] Draw status distinguishes from win/loss
- [ ] No false draws (draw only when board is completely full)

### Move Validation
- [ ] Reject move on occupied cell (no overwrite)
- [ ] Reject move outside board bounds
- [ ] Accept move only on empty cell
- [ ] Accept move only within 0-2 coordinates
- [ ] No moves allowed after win detected
- [ ] No moves allowed after loss detected
- [ ] No moves allowed after draw detected

### Game State
- [ ] Track current player (X or O)
- [ ] Track whose turn it is (player or AI)
- [ ] Prevent double-moves (same player twice in a row)
- [ ] Enforce X always goes first
- [ ] Prevent moves during AI's turn
- [ ] Prevent moves after game ends

### Reset/New Game
- [ ] Reset clears all cells back to empty
- [ ] Reset allows new game to start
- [ ] Reset preserves selected difficulty level (unless player changes it)
- [ ] Player (X) moves first in new game

## Edge Cases
- Player wins on move 5 (first possible win for X: X at moves 1,3,5)
- AI wins on move 6 (first possible win for O: O at moves 2,4,6)
- Board fills to move 9 with no winner (draw)
- Player attempts move on occupied cell → rejected silently
- Player attempts move outside board (-1,0), (3,5), etc. → rejected silently
- Player attempts move after win detected → rejected silently
- Player attempts move after AI already won → rejected silently
- Draw detected on move 9 when last cell fills board completely
- Win detected with multiple winning combinations (e.g., 2 rows completed same turn - shouldn't happen in legal play, but handle gracefully)
- Same cell clicked twice by accident → second click rejected

## Win Combinations (All 8)

### Rows
- Row 0: cells (0,0), (0,1), (0,2)
- Row 1: cells (1,0), (1,1), (1,2)
- Row 2: cells (2,0), (2,1), (2,2)

### Columns
- Col 0: cells (0,0), (1,0), (2,0)
- Col 1: cells (0,1), (1,1), (2,1)
- Col 2: cells (0,2), (1,2), (2,2)

### Diagonals
- Diagonal 1: cells (0,0), (1,1), (2,2)
- Diagonal 2: cells (0,2), (1,1), (2,0)

## Example Scenarios

### Scenario 1: Player Wins (Row)
```
Move 1 (X): (0,0) →  X | _ | _
Move 2 (O): (1,0) →  O | _ | _
Move 3 (X): (0,1) →  X | X | _
Move 4 (O): (1,1) →  O | O | _
Move 5 (X): (0,2) →  X | X | X  ← Player wins! (row 0)
Game ends. No move 6.
```

### Scenario 2: AI Wins (Diagonal)
```
Move 1 (X): (0,1) →  _ | X | _
Move 2 (O): (0,0) →  O | X | _
Move 3 (X): (1,0) →  O | X | _
Move 4 (O): (1,1) →  O | O | _
Move 5 (X): (2,0) →  O | O | _
Move 6 (O): (2,2) →  O | O | O  ← AI wins! (diagonal: 0,0 → 1,1 → 2,2)
Game ends. No move 7.
```

### Scenario 3: Draw
```
Move 1 (X): (0,0) →  X | _ | _
Move 2 (O): (0,1) →  X | O | _
Move 3 (X): (0,2) →  X | O | X
Move 4 (O): (1,0) →  X | O | X
Move 5 (X): (1,2) →  X | O | X
Move 6 (O): (1,1) →  X | O | X
Move 7 (X): (2,0) →  X | O | X
Move 8 (O): (2,2) →  X | O | X
Move 9 (X): (2,1) →  X | O | X  ← Board full, no winner. Draw!
                      O | O | X
                      X | X | O
Game ends.
```

## Implementation Notes
- Win detection should be efficient (check affected row/column/diagonals, not entire board each time)
- Board state should be immutable (use copies when evaluating moves)
- Track game status separately: ONGOING, PLAYER_WON, AI_WON, DRAW
- Prevent state corruption (don't allow illegal moves to modify board)
- Consider: caching win state for performance (minimax uses this)
