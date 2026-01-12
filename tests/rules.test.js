/**
 * Game Rules Tests
 * Tests for src/lib/rules.js
 */

import { describe, it, expect } from 'vitest';
import {
	WIN_COMBINATIONS,
	checkWin,
	checkDraw,
	validateMove,
	validateMoveByIndex,
	getWinningMove,
	getGameResult
} from '$lib/rules.js';

describe('WIN_COMBINATIONS', () => {
	it('should have exactly 8 winning combinations', () => {
		expect(WIN_COMBINATIONS).toHaveLength(8);
	});

	it('should contain 3 row combinations', () => {
		expect(WIN_COMBINATIONS).toContainEqual([0, 1, 2]); // Top row
		expect(WIN_COMBINATIONS).toContainEqual([3, 4, 5]); // Middle row
		expect(WIN_COMBINATIONS).toContainEqual([6, 7, 8]); // Bottom row
	});

	it('should contain 3 column combinations', () => {
		expect(WIN_COMBINATIONS).toContainEqual([0, 3, 6]); // Left column
		expect(WIN_COMBINATIONS).toContainEqual([1, 4, 7]); // Middle column
		expect(WIN_COMBINATIONS).toContainEqual([2, 5, 8]); // Right column
	});

	it('should contain 2 diagonal combinations', () => {
		expect(WIN_COMBINATIONS).toContainEqual([0, 4, 8]); // Top-left to bottom-right
		expect(WIN_COMBINATIONS).toContainEqual([2, 4, 6]); // Top-right to bottom-left
	});
});

describe('checkWin', () => {
	it('should detect X win on top row', () => {
		const board = ['X', 'X', 'X', null, 'O', 'O', null, null, null];
		expect(checkWin(board, 'X')).toEqual([0, 1, 2]);
	});

	it('should detect X win on middle row', () => {
		const board = ['O', null, 'O', 'X', 'X', 'X', null, null, null];
		expect(checkWin(board, 'X')).toEqual([3, 4, 5]);
	});

	it('should detect X win on bottom row', () => {
		const board = [null, 'O', 'O', null, null, null, 'X', 'X', 'X'];
		expect(checkWin(board, 'X')).toEqual([6, 7, 8]);
	});

	it('should detect O win on left column', () => {
		const board = ['O', 'X', 'X', 'O', null, null, 'O', null, null];
		expect(checkWin(board, 'O')).toEqual([0, 3, 6]);
	});

	it('should detect O win on middle column', () => {
		const board = ['X', 'O', null, null, 'O', 'X', null, 'O', null];
		expect(checkWin(board, 'O')).toEqual([1, 4, 7]);
	});

	it('should detect O win on right column', () => {
		const board = [null, 'X', 'O', 'X', null, 'O', null, null, 'O'];
		expect(checkWin(board, 'O')).toEqual([2, 5, 8]);
	});

	it('should detect X win on main diagonal', () => {
		const board = ['X', 'O', null, null, 'X', 'O', null, null, 'X'];
		expect(checkWin(board, 'X')).toEqual([0, 4, 8]);
	});

	it('should detect O win on anti-diagonal', () => {
		const board = ['X', null, 'O', null, 'O', 'X', 'O', null, null];
		expect(checkWin(board, 'O')).toEqual([2, 4, 6]);
	});

	it('should return null when no win', () => {
		const board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
		expect(checkWin(board, 'X')).toBe(null);
		expect(checkWin(board, 'O')).toBe(null);
	});

	it('should return null for empty board', () => {
		const board = Array(9).fill(null);
		expect(checkWin(board, 'X')).toBe(null);
		expect(checkWin(board, 'O')).toBe(null);
	});
});

describe('checkDraw', () => {
	it('should return true for full board with no winner', () => {
		// Classic draw board
		const board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
		expect(checkDraw(board)).toBe(true);
	});

	it('should return false for non-full board', () => {
		const board = ['X', 'O', null, null, null, null, null, null, null];
		expect(checkDraw(board)).toBe(false);
	});

	it('should return false when there is a winner', () => {
		const board = ['X', 'X', 'X', 'O', 'O', null, null, null, null];
		expect(checkDraw(board)).toBe(false);
	});

	it('should return false for empty board', () => {
		const board = Array(9).fill(null);
		expect(checkDraw(board)).toBe(false);
	});
});

describe('validateMove', () => {
	it('should accept valid move on empty cell', () => {
		const board = Array(9).fill(null);
		expect(validateMove(board, 0, 0)).toBe(true);
		expect(validateMove(board, 1, 1)).toBe(true);
		expect(validateMove(board, 2, 2)).toBe(true);
	});

	it('should reject move on occupied cell', () => {
		const board = Array(9).fill(null);
		board[0] = 'X';
		expect(validateMove(board, 0, 0)).toBe(false);
	});

	it('should reject out of bounds move', () => {
		const board = Array(9).fill(null);
		expect(validateMove(board, -1, 0)).toBe(false);
		expect(validateMove(board, 0, -1)).toBe(false);
		expect(validateMove(board, 3, 0)).toBe(false);
		expect(validateMove(board, 0, 3)).toBe(false);
	});
});

describe('validateMoveByIndex', () => {
	it('should accept valid index on empty cell', () => {
		const board = Array(9).fill(null);
		expect(validateMoveByIndex(board, 0)).toBe(true);
		expect(validateMoveByIndex(board, 4)).toBe(true);
		expect(validateMoveByIndex(board, 8)).toBe(true);
	});

	it('should reject occupied cell', () => {
		const board = Array(9).fill(null);
		board[4] = 'X';
		expect(validateMoveByIndex(board, 4)).toBe(false);
	});

	it('should reject out of bounds index', () => {
		const board = Array(9).fill(null);
		expect(validateMoveByIndex(board, -1)).toBe(false);
		expect(validateMoveByIndex(board, 9)).toBe(false);
	});
});

describe('getWinningMove', () => {
	it('should find winning move for X', () => {
		// X has 2 in top row, needs position 2
		const board = ['X', 'X', null, 'O', 'O', null, null, null, null];
		expect(getWinningMove(board, 'X')).toBe(2);
	});

	it('should find winning move for O', () => {
		// O has 2 in left column, needs position 6
		const board = ['O', 'X', 'X', 'O', null, null, null, null, null];
		expect(getWinningMove(board, 'O')).toBe(6);
	});

	it('should find winning move on diagonal', () => {
		// X has 2 on main diagonal, needs position 8
		const board = ['X', 'O', null, null, 'X', 'O', null, null, null];
		expect(getWinningMove(board, 'X')).toBe(8);
	});

	it('should return null when no winning move exists', () => {
		const board = ['X', 'O', null, null, null, null, null, null, null];
		expect(getWinningMove(board, 'X')).toBe(null);
	});

	it('should return first winning move if multiple exist', () => {
		// X can win on row 0 (pos 2) or column 0 (pos 6)
		const board = ['X', 'X', null, 'X', 'O', 'O', null, null, null];
		const move = getWinningMove(board, 'X');
		expect([2, 6]).toContain(move);
	});
});

describe('getGameResult', () => {
	it('should return PLAYER_WON when X wins', () => {
		const board = ['X', 'X', 'X', 'O', 'O', null, null, null, null];
		expect(getGameResult(board)).toBe('PLAYER_WON');
	});

	it('should return AI_WON when O wins', () => {
		const board = ['O', 'X', 'X', 'O', null, null, 'O', null, null];
		expect(getGameResult(board)).toBe('AI_WON');
	});

	it('should return DRAW when board is full with no winner', () => {
		const board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
		expect(getGameResult(board)).toBe('DRAW');
	});

	it('should return ONGOING for game in progress', () => {
		const board = ['X', 'O', null, null, null, null, null, null, null];
		expect(getGameResult(board)).toBe('ONGOING');
	});

	it('should return ONGOING for empty board', () => {
		const board = Array(9).fill(null);
		expect(getGameResult(board)).toBe('ONGOING');
	});
});
