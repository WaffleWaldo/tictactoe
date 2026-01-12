# Game Flow & Orchestration

## Purpose
Manage the overall game flow, orchestrate interactions between components (board, rules, AI, UI), and ensure proper sequencing of game states.

## What It Does
- Initialize a new game (empty board, player starts, select difficulty)
- Handle player moves (click cell → validate → apply → check win/draw → switch turn → AI move)
- Handle AI moves (AI calculates → apply → check win/draw → switch turn)
- Manage turn sequencing (player turn ↔ AI turn)
- Detect and declare game end states (player wins, AI wins, draw)
- Display game outcomes to player (win/loss/draw screen)
- Handle game reset (new game after win/loss/draw)
- Allow difficulty selection before game starts
- Prevent moves during AI thinking
- Coordinate between Board State, Game Rules, AI, and UI components

## Game State Machine

```
START
  ↓
[Player selects difficulty: Easy or Hard]
  ↓
GAME_INITIALIZED (board empty, status ONGOING)
  ↓
PLAYER_TURN
  ├─ Player clicks cell
  ├─ Validate move (legal? not occupied? game ongoing?)
  ├─ If invalid → reject (no state change)
  ├─ If valid → place move on board
  ├─ Check win/draw → GAME_CHECK
  
GAME_CHECK (after any move)
  ├─ Is someone 3 in a row? → GAME_END (WINNER)
  ├─ Is board full? → GAME_END (DRAW)
  ├─ Otherwise → continue
  
GAME_END (with outcome)
  ├─ Display win/loss/draw screen
  ├─ Disable further moves
  ├─ Wait for "Play Again" click
  ├─ When clicked → reset board + go to START
  
If game continues (no win/draw):
  ├─ Switch turn to AI
  ├─ Go to AI_TURN
  
AI_TURN
  ├─ Disable player clicks (UI locked)
  ├─ AI calculates move (Easy: random, Hard: minimax)
  ├─ Small delay (<500ms) for UX (feels natural)
  ├─ Apply AI move to board
  ├─ Check win/draw → GAME_CHECK
  ├─ If game continues:
  │   ├─ Switch turn back to player
  │   └─ Go to PLAYER_TURN
```

## What It Does (Detailed)

### Game Initialization
- Create new Board instance
- Set board to empty state
- Set status to ONGOING
- Set current player to X (Player)
- Set current turn to PLAYER
- Wait for difficulty selection (Easy or Hard)
- Store selected difficulty
- Display board with difficulty shown
- Ready for first player move

### Player Move Flow
- Player clicks cell at (row, col)
- Check: Is game ongoing? (if not, ignore click)
- Check: Is it player's turn? (if not, ignore click)
- Validate move with Game Rules (legal position, unoccupied cell)
- If invalid: reject silently, don't change state
- If valid:
  - Place move on Board (mark cell as X)
  - Check Game Rules for win/draw/loss
  - Update UI (show new board state)
  - If game continues: proceed to AI turn

### AI Move Flow
- Lock UI (prevent player clicks during AI thinking)
- Get current difficulty level (Easy or Hard)
- Get available moves from Board
- Call AI Opponent to calculate best move
- Optional: add small delay (100-300ms) for natural feel
- Place AI move on Board (mark cell as O)
- Check Game Rules for win/draw/loss
- Update UI (show new board state)
- Unlock UI
- If game continues: set turn back to PLAYER_TURN

### Game End Flow
- Detect end condition: win, loss, or draw
- Display outcome screen (modal/overlay)
- Show message: "Player Wins!", "AI Wins!", or "It's a Draw!"
- Display "Play Again" button
- Disable all game interactions except "Play Again" button
- On "Play Again" click: reset game and return to GAME_INITIALIZED

### Difficulty Selection
- Before first move, player selects Easy or Hard
- Easy: AI uses random move strategy
- Hard: AI uses minimax (optimal play)
- Selection persists until "Play Again" (at which point player can select again)
- If player doesn't select, default to Hard (or show required selection)

### Reset/New Game
- Clear board (all cells empty)
- Reset status to ONGOING
- Reset turn to PLAYER
- Optionally: clear difficulty selection (require re-selection) OR keep it
- Hide end-game screen
- Enable player interactions
- Ready for first move of new game

## Acceptance Criteria

### Game Initialization
- [ ] New game starts with empty board
- [ ] Status is ONGOING
- [ ] Player (X) is current player
- [ ] Difficulty selector is visible
- [ ] Difficulty cannot be changed mid-game (only before start or after reset)
- [ ] Game waits for difficulty selection before allowing moves
- [ ] Selected difficulty is displayed
- [ ] First move must be by Player (X)

### Player Move Handling
- [ ] Player can click empty cells during their turn
- [ ] Player cannot click during AI turn (UI locked)
- [ ] Player cannot click after game ends
- [ ] Valid moves are applied to board
- [ ] Invalid moves are rejected silently
- [ ] Board is updated immediately after valid move
- [ ] UI shows X on clicked cell

### AI Move Handling
- [ ] AI only moves during AI turn
- [ ] AI move respects difficulty level (Easy: random, Hard: minimax)
- [ ] AI move is legal (unoccupied cell, within bounds)
- [ ] AI move completes within 500ms
- [ ] Board is updated after AI move
- [ ] UI shows O on AI-selected cell
- [ ] Player cannot click during AI thinking

### Win Detection & Display
- [ ] Player win is detected when X gets 3 in a row
- [ ] AI win is detected when O gets 3 in a row
- [ ] Draw is detected when board fills with no winner
- [ ] Win/loss/draw screen displays immediately
- [ ] Correct outcome message shown ("Player Wins!", "AI Wins!", "It's a Draw!")
- [ ] "Play Again" button is functional

### Turn Management
- [ ] Turns alternate correctly (X, O, X, O, ...)
- [ ] Player always goes first (X on move 1, 3, 5, 7, 9)
- [ ] AI always goes second (O on move 2, 4, 6, 8)
- [ ] No double-moves (same player twice in a row)
- [ ] Turn doesn't advance during invalid move

### Game Flow Integration
- [ ] Board state, Rules, AI, and UI work together seamlessly
- [ ] Move from UI → Board → Rules → AI (if game continues) → UI
- [ ] State is consistent across all components
- [ ] No orphaned state or desynchronization
- [ ] Reset clears all state properly

### Reset/New Game
- [ ] "Play Again" resets board to empty
- [ ] "Play Again" allows new game to start
- [ ] "Play Again" resets status to ONGOING
- [ ] "Play Again" resets turn to Player (X)
- [ ] "Play Again" does not change difficulty (player can manually change if desired)
- [ ] Game works correctly through multiple play sessions

## Edge Cases
- Player clicks cell as AI is calculating move
- Player clicks "Play Again" multiple times rapidly
- Difficulty is changed mid-game (should be prevented)
- Browser is minimized during AI calculation
- Player closes difficulty selector without selecting (require selection)
- Player wins on move 5 (fastest possible for X)
- AI wins on move 6 (fastest possible for O)
- Draw on move 9 (board completely fills)
- Same cell clicked twice by player (second click rejected)
- Game reset while AI move is pending

## Coordination Between Components

### With Board State
- Request empty board (initialize)
- Request current board state (display UI)
- Place player move (X)
- Place AI move (O)
- Request available moves (for AI calculation)
- Reset board (new game)

### With Game Rules
- Validate player move (legal?)
- Check for win/draw after each move
- Detect game end conditions

### With AI Opponent
- Pass difficulty level (Easy or Hard)
- Pass current board state
- Get AI's recommended move
- Apply move to board

### With UI
- Request display of board state
- Handle cell clicks (translate to coordinates)
- Show/hide difficulty selector
- Show/hide game end screen
- Enable/disable player interactions during AI turn
- Display messages (current turn, outcome)

## Sequence Diagrams

### Normal Game Flow (Simplified)
```
Player Init
  ↓
Select Difficulty
  ↓
Show Board (empty, X's turn)
  ↓
Player Clicks Cell → Validate → Place X → Check Win
  ├─ No winner → Switch to AI turn
  │
  ↓
AI Calculates → Place O → Check Win
  ├─ No winner → Switch to Player turn → back to step "Player Clicks"
  ├─ AI Wins → Show "AI Wins!" → Reset
  └─ Draw → Show "Draw!" → Reset
  
  └─ Player Wins → Show "Player Wins!" → Reset
```

### Player Move Detail
```
1. Player clicks cell at (row, col)
2. Check: is game ONGOING? (yes → continue)
3. Check: is it PLAYER turn? (yes → continue)
4. Validate move with Rules (check if empty, within bounds)
5. If invalid → reject, no state change
6. If valid:
   a. Board.placeMove(row, col, 'X')
   b. Rules.checkWin('X') → any winner?
   c. Rules.checkDraw() → board full?
   d. UI.updateBoard(board.getBoard())
   e. If winner or draw → show end screen
   f. If game continues → set turn to AI → proceed to AI move
```

## Implementation Notes
- Use a single GameController or GameEngine class to orchestrate
- Keep clear separation of concerns (Controller coordinates, components handle specifics)
- Use events or callbacks to decouple components (board change → UI update)
- Test state transitions thoroughly (all paths through state machine)
- Add logging/debugging for state changes (helpful during development)
- Consider: debounce/throttle player clicks during AI turn to prevent accidental multi-clicks
- Timing: delay AI move slightly (100-300ms) so it feels more natural and less instant
