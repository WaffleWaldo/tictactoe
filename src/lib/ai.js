/**
 * AI Opponent
 * Generates intelligent moves for the AI player (O).
 *
 * Difficulty levels:
 * - EASY: Random valid moves (beatable)
 * - HARD: Minimax with alpha-beta pruning (optimal/unbeatable)
 *
 * Performance requirements:
 * - Easy mode: <10ms
 * - Hard mode: <500ms
 *
 * Minimax scoring:
 * - AI (O) win: +10
 * - Draw: 0
 * - Player (X) win: -10
 * - Subtract depth for faster wins
 */

import { checkWin, checkDraw } from './rules.js';

/**
 * Get available (empty) moves from board
 * @param {Array<string|null>} board - 9-element board array
 * @returns {number[]} Array of empty cell indices
 */
function getAvailableMoves(board) {
	const moves = [];
	for (let i = 0; i < 9; i++) {
		if (board[i] === null) {
			moves.push(i);
		}
	}
	return moves;
}

/**
 * Select a random move from available cells (Easy mode)
 * @param {Array<string|null>} board - 9-element board array
 * @returns {number|null} Random empty cell index, or null if none
 */
export function getRandomMove(board) {
	const available = getAvailableMoves(board);
	if (available.length === 0) {
		return null;
	}
	const randomIndex = Math.floor(Math.random() * available.length);
	return available[randomIndex];
}

/**
 * Minimax algorithm with alpha-beta pruning
 * Evaluates board position recursively to find optimal play.
 *
 * @param {Array<string|null>} board - Current board state
 * @param {number} depth - Current search depth
 * @param {boolean} isMaximizing - True if AI's turn (maximizing), false if player's turn (minimizing)
 * @param {number} alpha - Best value maximizer can guarantee
 * @param {number} beta - Best value minimizer can guarantee
 * @returns {number} Score of the position
 */
export function minimax(board, depth, isMaximizing, alpha, beta) {
	// Check terminal states
	if (checkWin(board, 'O')) {
		return 10 - depth; // AI wins, prefer faster wins
	}
	if (checkWin(board, 'X')) {
		return depth - 10; // Player wins, prefer slower losses
	}
	if (checkDraw(board)) {
		return 0;
	}

	const available = getAvailableMoves(board);

	if (isMaximizing) {
		// AI's turn - maximize score
		let maxScore = -Infinity;
		for (const move of available) {
			// Make move
			board[move] = 'O';
			const score = minimax(board, depth + 1, false, alpha, beta);
			// Undo move
			board[move] = null;

			maxScore = Math.max(maxScore, score);
			alpha = Math.max(alpha, score);

			// Alpha-beta pruning
			if (beta <= alpha) {
				break;
			}
		}
		return maxScore;
	} else {
		// Player's turn - minimize score
		let minScore = Infinity;
		for (const move of available) {
			// Make move
			board[move] = 'X';
			const score = minimax(board, depth + 1, true, alpha, beta);
			// Undo move
			board[move] = null;

			minScore = Math.min(minScore, score);
			beta = Math.min(beta, score);

			// Alpha-beta pruning
			if (beta <= alpha) {
				break;
			}
		}
		return minScore;
	}
}

/**
 * Get optimal move using minimax (Hard mode)
 * @param {Array<string|null>} board - 9-element board array
 * @returns {number|null} Optimal cell index, or null if none
 */
export function getMinimaxMove(board) {
	const available = getAvailableMoves(board);
	if (available.length === 0) {
		return null;
	}

	let bestMove = null;
	let bestScore = -Infinity;

	// Create a copy to avoid mutating original
	const boardCopy = [...board];

	for (const move of available) {
		// Make move
		boardCopy[move] = 'O';
		const score = minimax(boardCopy, 0, false, -Infinity, Infinity);
		// Undo move
		boardCopy[move] = null;

		if (score > bestScore) {
			bestScore = score;
			bestMove = move;
		}
	}

	return bestMove;
}

/**
 * Get AI move based on difficulty
 * @param {Array<string|null>} board - 9-element board array
 * @param {string} difficulty - 'EASY' or 'HARD'
 * @returns {number|null} Selected cell index, or null if no moves
 */
export function getMove(board, difficulty) {
	if (difficulty === 'EASY') {
		return getRandomMove(board);
	}
	// Default to HARD (minimax)
	return getMinimaxMove(board);
}
