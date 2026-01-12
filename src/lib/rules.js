/**
 * Game Rules & Win Conditions
 * Defines tic-tac-toe rules, detects win/loss/draw, validates moves.
 *
 * Win conditions: 8 total combinations
 * - 3 rows, 3 columns, 2 diagonals
 *
 * Game status values: 'ONGOING', 'PLAYER_WON', 'AI_WON', 'DRAW'
 */

/**
 * All 8 winning combinations as flat indices
 * Rows: [0,1,2], [3,4,5], [6,7,8]
 * Columns: [0,3,6], [1,4,7], [2,5,8]
 * Diagonals: [0,4,8], [2,4,6]
 */
export const WIN_COMBINATIONS = [
	// Rows
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	// Columns
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	// Diagonals
	[0, 4, 8],
	[2, 4, 6]
];

/**
 * Check if specified player has won
 * @param {Array<string|null>} board - 9-element board array
 * @param {string} player - 'X' or 'O'
 * @returns {number[]|null} Winning combination indices or null
 */
export function checkWin(board, player) {
	for (const combo of WIN_COMBINATIONS) {
		const [a, b, c] = combo;
		if (board[a] === player && board[b] === player && board[c] === player) {
			return combo;
		}
	}
	return null;
}

/**
 * Check if board is a draw (full with no winner)
 * @param {Array<string|null>} board - 9-element board array
 * @returns {boolean} True if draw
 */
export function checkDraw(board) {
	// Check if anyone has won
	if (checkWin(board, 'X') || checkWin(board, 'O')) {
		return false;
	}
	// Check if board is full
	return board.every(cell => cell !== null);
}

/**
 * Validate if a move is legal
 * @param {Array<string|null>} board - 9-element board array
 * @param {number} row - Row 0-2
 * @param {number} col - Column 0-2
 * @returns {boolean} True if move is valid
 */
export function validateMove(board, row, col) {
	// Check bounds
	if (row < 0 || row > 2 || col < 0 || col > 2) {
		return false;
	}
	// Check if cell is empty
	const index = row * 3 + col;
	return board[index] === null;
}

/**
 * Validate move by flat index
 * @param {Array<string|null>} board - 9-element board array
 * @param {number} index - Flat index 0-8
 * @returns {boolean} True if move is valid
 */
export function validateMoveByIndex(board, index) {
	if (index < 0 || index > 8) {
		return false;
	}
	return board[index] === null;
}

/**
 * Get the winning move for a player (if one exists)
 * @param {Array<string|null>} board - 9-element board array
 * @param {string} player - 'X' or 'O'
 * @returns {number|null} Cell index that would win, or null
 */
export function getWinningMove(board, player) {
	for (const combo of WIN_COMBINATIONS) {
		const [a, b, c] = combo;
		const cells = [board[a], board[b], board[c]];
		const playerCount = cells.filter(c => c === player).length;
		const emptyCount = cells.filter(c => c === null).length;

		// If player has 2 and there's 1 empty, that's a winning move
		if (playerCount === 2 && emptyCount === 1) {
			// Find the empty cell
			if (board[a] === null) return a;
			if (board[b] === null) return b;
			if (board[c] === null) return c;
		}
	}
	return null;
}

/**
 * Get current game result
 * @param {Array<string|null>} board - 9-element board array
 * @returns {string} 'ONGOING', 'PLAYER_WON', 'AI_WON', or 'DRAW'
 */
export function getGameResult(board) {
	// Check if X (player) won
	if (checkWin(board, 'X')) {
		return 'PLAYER_WON';
	}
	// Check if O (AI) won
	if (checkWin(board, 'O')) {
		return 'AI_WON';
	}
	// Check for draw
	if (checkDraw(board)) {
		return 'DRAW';
	}
	return 'ONGOING';
}
