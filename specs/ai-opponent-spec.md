# AI Opponent

## Purpose
Generate intelligent moves for the AI player (O) with two difficulty levels: Easy (beatable) and Hard (optimal/unbeatable).

## What It Does

### Easy Difficulty
- AI makes random valid moves from available cells
- No strategy or lookahead
- Player can consistently beat this difficulty
- Roughly 50% win rate for competent player

### Hard Difficulty
- AI uses minimax algorithm with perfect play
- Evaluates all possible future game states
- Chooses move that maximizes AI's chances of winning
- Minimizes player's chances of winning
- Hard to beat (unbeatable with perfect play from opponent)
- Should result in frequent draws and occasional AI wins

## What It Does (Detailed)
- Determine which difficulty level is selected (Easy or Hard)
- Receive current board state as input
- Generate a valid move (unoccupied cell)
- Return move as coordinates (row, col) or cell index
- For Easy: randomly select from available cells
- For Hard: use minimax algorithm to evaluate all possible moves
- Execute selected move on board
- Complete move in reasonable time (<500ms for responsiveness)

## Acceptance Criteria

### General
- [ ] AI move is always legal (cell is unoccupied, within bounds)
- [ ] AI move is returned as valid board position
- [ ] AI completes move within 500ms (UI feels responsive)
- [ ] AI doesn't move during player's turn
- [ ] AI only makes one move per turn
- [ ] AI cannot move after game ends (win/loss/draw)
- [ ] AI recognizes when it has already won (stops playing)
- [ ] AI recognizes when board is full (draw condition)

### Easy Difficulty
- [ ] AI selects from valid available moves only
- [ ] All valid moves have equal probability (random selection)
- [ ] Player can win most games with reasonable play
- [ ] Game length varies (3-9 moves for AI, depending on play)
- [ ] No pattern detection or strategic behavior

### Hard Difficulty
- [ ] AI uses minimax algorithm (or equivalent optimal strategy)
- [ ] AI prioritizes winning move if available
- [ ] AI blocks player's winning move if available and AI can't win
- [ ] AI plays optimally (minimizes player's winning chances)
- [ ] Game often ends in draw with skilled player
- [ ] Player loses if makes suboptimal moves
- [ ] AI consistently plays perfectly

## Edge Cases
- Board is full (no valid moves available) - AI recognizes draw
- Only one cell available - AI takes it
- AI can win this turn - AI wins immediately
- Player can win next turn - AI blocks if playing Hard
- AI has two ways to win - AI takes first available winning move
- Player has two ways to win - AI blocks one (but player wins with other)
- Early game (many empty cells) - Hard difficulty shouldn't delay noticeably
- Endgame (one or two cells left) - move is computed instantly

## Algorithm Details

### Easy Mode
```
availableMoves = find all empty cells on board
randomMove = select random move from availableMoves
return randomMove
```

### Hard Mode (Minimax Approach)
```
function minimax(board, isAITurn):
  if board is terminal state (someone won or draw):
    return score: AI win = +10, draw = 0, player win = -10
  
  if isAITurn:
    maxScore = -infinity
    for each empty cell:
      place AI move (O)
      score = minimax(board, false)
      undo move
      maxScore = max(maxScore, score)
    return maxScore
  else:
    minScore = +infinity
    for each empty cell:
      place player move (X)
      score = minimax(board, true)
      undo move
      minScore = min(minScore, score)
    return minScore

function getAIMove(board):
  bestScore = -infinity
  bestMove = null
  for each empty cell:
    place AI move (O)
    score = minimax(board, false)
    undo move
    if score > bestScore:
      bestScore = score
      bestMove = cell
  return bestMove
```

## Performance Requirements
- Easy mode: <10ms
- Hard mode: <500ms (even with 5+ empty cells)
- Should not freeze UI during calculation

## Implementation Notes
- Minimax can be optimized with alpha-beta pruning to reduce computation
- Consider memoization if needed
- Keep minimax evaluation function separate from move selection
- Test both difficulties thoroughly before deployment
- Consider: can player choose difficulty mid-game? (No - should restart)

## Example Scenarios

### Easy Difficulty Example
```
Board state:
  X | _ | _
  ---------
  _ | O | _
  ---------
  _ | _ | _

Available moves: (0,1), (0,2), (1,0), (1,2), (2,0), (2,1), (2,2)
AI Easy selects random: e.g., (2,1)

Result:
  X | _ | _
  ---------
  _ | O | _
  ---------
  _ | O | _
```

### Hard Difficulty Example
```
Board state:
  X | _ | _
  ---------
  _ | O | _
  ---------
  _ | _ | _

Minimax evaluates all moves. Player can win at (0,2) next turn if not blocked.
AI Hard chooses to block: (0,2)

Result:
  X | _ | O
  ---------
  _ | O | _
  ---------
  _ | _ | _
```
