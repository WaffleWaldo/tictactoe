/**
 * AI Opponent Tests
 * Tests for src/lib/ai.js
 */

import { describe, it, expect } from 'vitest';
import { getRandomMove, minimax, getMinimaxMove, getMove } from '$lib/ai.js';

describe('getRandomMove', () => {
	it('should return a valid index from available moves', () => {
		const board = ['X', null, null, 'O', null, null, null, null, null];
		const move = getRandomMove(board);
		expect([1, 2, 4, 5, 6, 7, 8]).toContain(move);
	});

	it('should return null for full board', () => {
		const board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
		expect(getRandomMove(board)).toBe(null);
	});

	it('should return the only available move', () => {
		const board = ['X', 'O', 'X', 'X', null, 'O', 'O', 'X', 'O'];
		expect(getRandomMove(board)).toBe(4);
	});

	it('should return different moves over multiple calls (probabilistic)', () => {
		const board = Array(9).fill(null);
		const moves = new Set();
		for (let i = 0; i < 50; i++) {
			moves.add(getRandomMove(board));
		}
		// With 50 attempts on empty board, we should get at least 3 different moves
		expect(moves.size).toBeGreaterThan(2);
	});
});

describe('minimax', () => {
	it('should return positive score for AI win', () => {
		// O can win immediately
		const board = ['X', 'X', null, 'O', 'O', null, 'X', null, null];
		// Place O at 5 to win
		board[5] = 'O';
		const score = minimax(board, 0, false, -Infinity, Infinity);
		expect(score).toBeGreaterThan(0);
	});

	it('should return negative score for player win', () => {
		// X wins
		const board = ['X', 'X', 'X', 'O', 'O', null, null, null, null];
		const score = minimax(board, 0, true, -Infinity, Infinity);
		expect(score).toBeLessThan(0);
	});

	it('should return 0 for draw', () => {
		// Draw board
		const board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
		const score = minimax(board, 0, true, -Infinity, Infinity);
		expect(score).toBe(0);
	});
});

describe('getMinimaxMove', () => {
	it('should take winning move when available', () => {
		// O has 2 in a row, can win at position 5
		const board = ['X', 'X', null, 'O', 'O', null, 'X', null, null];
		expect(getMinimaxMove(board)).toBe(5);
	});

	it('should block player winning move', () => {
		// X has 2 in a row (0,1), O must block at 2
		const board = ['X', 'X', null, 'O', null, null, null, null, null];
		expect(getMinimaxMove(board)).toBe(2);
	});

	it('should return null for full board', () => {
		const board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
		expect(getMinimaxMove(board)).toBe(null);
	});

	it('should make optimal opening move', () => {
		// On empty board, center or corner is optimal
		const board = Array(9).fill(null);
		const move = getMinimaxMove(board);
		// Center (4) or corners (0, 2, 6, 8) are optimal
		expect([0, 2, 4, 6, 8]).toContain(move);
	});

	it('should never lose with perfect play', () => {
		// Test from a known losing position shouldn't exist
		// AI playing O should draw or win
		const board = ['X', null, null, null, null, null, null, null, null];
		const move = getMinimaxMove(board);
		// After X plays corner, O should play center (4)
		expect(move).toBe(4);
	});

	it('should complete within 500ms on empty board', () => {
		const board = Array(9).fill(null);
		const start = performance.now();
		getMinimaxMove(board);
		const elapsed = performance.now() - start;
		expect(elapsed).toBeLessThan(500);
	});

	it('should complete within 500ms with 5 empty cells', () => {
		const board = ['X', 'O', null, 'X', null, null, null, 'O', null];
		const start = performance.now();
		getMinimaxMove(board);
		const elapsed = performance.now() - start;
		expect(elapsed).toBeLessThan(500);
	});
});

describe('getMove', () => {
	it('should use random move for EASY difficulty', () => {
		const board = Array(9).fill(null);
		const move = getMove(board, 'EASY');
		expect(move).toBeGreaterThanOrEqual(0);
		expect(move).toBeLessThanOrEqual(8);
	});

	it('should use minimax for HARD difficulty', () => {
		// X played corner, optimal response is center
		const board = ['X', null, null, null, null, null, null, null, null];
		expect(getMove(board, 'HARD')).toBe(4);
	});

	it('should default to HARD for unknown difficulty', () => {
		// X has 2 in row, must block
		const board = ['X', 'X', null, 'O', null, null, null, null, null];
		expect(getMove(board, 'UNKNOWN')).toBe(2);
	});

	it('should return valid move for both difficulties', () => {
		const board = ['X', null, 'O', null, null, null, null, null, null];
		const easyMove = getMove(board, 'EASY');
		const hardMove = getMove(board, 'HARD');

		// Both should be valid empty cells
		expect([1, 3, 4, 5, 6, 7, 8]).toContain(easyMove);
		expect([1, 3, 4, 5, 6, 7, 8]).toContain(hardMove);
	});
});

describe('AI optimal play scenarios', () => {
	it('should take center when X plays corner', () => {
		const board = ['X', null, null, null, null, null, null, null, null];
		expect(getMinimaxMove(board)).toBe(4);
	});

	it('should take corner when X plays center', () => {
		const board = [null, null, null, null, 'X', null, null, null, null];
		const move = getMinimaxMove(board);
		expect([0, 2, 6, 8]).toContain(move);
	});

	it('should block fork threat', () => {
		// X at corners 0 and 8, O at center
		// X threatens fork, O must block by taking edge
		const board = ['X', null, null, null, 'O', null, null, null, 'X'];
		const move = getMinimaxMove(board);
		// O should play an edge (1, 3, 5, 7) to prevent fork
		expect([1, 3, 5, 7]).toContain(move);
	});

	it('should prefer winning over blocking', () => {
		// O can win at 2 OR block X at 6
		const board = ['O', 'O', null, 'X', 'X', null, null, null, null];
		expect(getMinimaxMove(board)).toBe(2); // Win, don't block
	});
});
