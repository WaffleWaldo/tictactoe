/**
 * Board State Management Tests
 * Tests for src/lib/board.js
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Board } from '$lib/board.js';

describe('Board', () => {
	let board;

	beforeEach(() => {
		board = new Board();
	});

	describe('initialization', () => {
		it('should initialize with empty board (9 nulls)', () => {
			expect(board.getBoard()).toEqual(Array(9).fill(null));
		});

		it('should initialize with X turn', () => {
			expect(board.getCurrentPlayer()).toBe('X');
		});

		it('should initialize with ONGOING status', () => {
			expect(board.getStatus()).toBe('ONGOING');
		});
	});

	describe('coordinate conversion', () => {
		it('should convert (row, col) to flat index correctly', () => {
			expect(board.toIndex(0, 0)).toBe(0);
			expect(board.toIndex(0, 1)).toBe(1);
			expect(board.toIndex(0, 2)).toBe(2);
			expect(board.toIndex(1, 0)).toBe(3);
			expect(board.toIndex(1, 1)).toBe(4);
			expect(board.toIndex(1, 2)).toBe(5);
			expect(board.toIndex(2, 0)).toBe(6);
			expect(board.toIndex(2, 1)).toBe(7);
			expect(board.toIndex(2, 2)).toBe(8);
		});

		it('should convert flat index to (row, col) correctly', () => {
			expect(board.toCoords(0)).toEqual({ row: 0, col: 0 });
			expect(board.toCoords(4)).toEqual({ row: 1, col: 1 });
			expect(board.toCoords(8)).toEqual({ row: 2, col: 2 });
		});
	});

	describe('isValid', () => {
		it('should return true for valid coordinates', () => {
			expect(board.isValid(0, 0)).toBe(true);
			expect(board.isValid(1, 1)).toBe(true);
			expect(board.isValid(2, 2)).toBe(true);
		});

		it('should return false for out of bounds coordinates', () => {
			expect(board.isValid(-1, 0)).toBe(false);
			expect(board.isValid(0, -1)).toBe(false);
			expect(board.isValid(3, 0)).toBe(false);
			expect(board.isValid(0, 3)).toBe(false);
		});
	});

	describe('placeMove', () => {
		it('should place X on empty cell and return true', () => {
			const result = board.placeMove(0, 0, 'X');
			expect(result).toBe(true);
			expect(board.getCell(0, 0)).toBe('X');
		});

		it('should place O on empty cell and return true', () => {
			const result = board.placeMove(1, 1, 'O');
			expect(result).toBe(true);
			expect(board.getCell(1, 1)).toBe('O');
		});

		it('should reject move on occupied cell and return false', () => {
			board.placeMove(0, 0, 'X');
			const result = board.placeMove(0, 0, 'O');
			expect(result).toBe(false);
			expect(board.getCell(0, 0)).toBe('X'); // Should remain X
		});

		it('should reject move out of bounds', () => {
			expect(board.placeMove(-1, 0, 'X')).toBe(false);
			expect(board.placeMove(0, 3, 'X')).toBe(false);
		});

		it('should reject invalid player symbol', () => {
			expect(board.placeMove(0, 0, 'Z')).toBe(false);
		});
	});

	describe('placeMoveByIndex', () => {
		it('should place move by flat index', () => {
			const result = board.placeMoveByIndex(4, 'X');
			expect(result).toBe(true);
			expect(board.getCellByIndex(4)).toBe('X');
		});
	});

	describe('getCell / getCellByIndex', () => {
		it('should return cell contents by coordinates', () => {
			board.placeMove(1, 2, 'X');
			expect(board.getCell(1, 2)).toBe('X');
		});

		it('should return cell contents by flat index', () => {
			board.placeMoveByIndex(5, 'O');
			expect(board.getCellByIndex(5)).toBe('O');
		});

		it('should return undefined for out of bounds', () => {
			expect(board.getCell(3, 0)).toBe(undefined);
			expect(board.getCellByIndex(9)).toBe(undefined);
			expect(board.getCellByIndex(-1)).toBe(undefined);
		});
	});

	describe('isEmpty / isOccupied', () => {
		it('should return isEmpty true for empty cell', () => {
			expect(board.isEmpty(0, 0)).toBe(true);
		});

		it('should return isEmpty false for occupied cell', () => {
			board.placeMove(0, 0, 'X');
			expect(board.isEmpty(0, 0)).toBe(false);
		});

		it('should return isOccupied true for occupied cell', () => {
			board.placeMove(0, 0, 'O');
			expect(board.isOccupied(0, 0)).toBe(true);
		});

		it('should return false for out of bounds coordinates', () => {
			expect(board.isEmpty(3, 0)).toBe(false);
			expect(board.isOccupied(3, 0)).toBe(false);
		});
	});

	describe('isFull', () => {
		it('should return false for empty board', () => {
			expect(board.isFull()).toBe(false);
		});

		it('should return false for partially filled board', () => {
			board.placeMove(0, 0, 'X');
			board.placeMove(1, 1, 'O');
			expect(board.isFull()).toBe(false);
		});

		it('should return true for full board', () => {
			// Fill the board
			const moves = ['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X'];
			for (let i = 0; i < 9; i++) {
				board.placeMoveByIndex(i, moves[i]);
			}
			expect(board.isFull()).toBe(true);
		});
	});

	describe('getAvailableMoves', () => {
		it('should return all 9 indices for empty board', () => {
			expect(board.getAvailableMoves()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
		});

		it('should return empty array for full board', () => {
			const moves = ['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X'];
			for (let i = 0; i < 9; i++) {
				board.placeMoveByIndex(i, moves[i]);
			}
			expect(board.getAvailableMoves()).toEqual([]);
		});

		it('should return correct empty cells for partially filled board', () => {
			board.placeMoveByIndex(0, 'X');
			board.placeMoveByIndex(4, 'O');
			board.placeMoveByIndex(8, 'X');
			expect(board.getAvailableMoves()).toEqual([1, 2, 3, 5, 6, 7]);
		});
	});

	describe('turn management', () => {
		it('should switch turn from X to O', () => {
			expect(board.getCurrentPlayer()).toBe('X');
			board.switchTurn();
			expect(board.getCurrentPlayer()).toBe('O');
		});

		it('should switch turn from O to X', () => {
			board.switchTurn(); // X -> O
			board.switchTurn(); // O -> X
			expect(board.getCurrentPlayer()).toBe('X');
		});

		it('should return correct player and AI symbols', () => {
			expect(board.getPlayerSymbol()).toBe('X');
			expect(board.getAISymbol()).toBe('O');
		});
	});

	describe('status management', () => {
		it('should get and set status correctly', () => {
			expect(board.getStatus()).toBe('ONGOING');
			board.setStatus('PLAYER_WON');
			expect(board.getStatus()).toBe('PLAYER_WON');
		});

		it('should detect game over state', () => {
			expect(board.isGameOver()).toBe(false);
			board.setStatus('AI_WON');
			expect(board.isGameOver()).toBe(true);
		});

		it('should detect draw as game over', () => {
			board.setStatus('DRAW');
			expect(board.isGameOver()).toBe(true);
		});
	});

	describe('reset', () => {
		it('should clear all cells', () => {
			board.placeMove(0, 0, 'X');
			board.placeMove(1, 1, 'O');
			board.reset();
			expect(board.getBoard()).toEqual(Array(9).fill(null));
		});

		it('should reset status to ONGOING', () => {
			board.setStatus('PLAYER_WON');
			board.reset();
			expect(board.getStatus()).toBe('ONGOING');
		});

		it('should reset turn to X', () => {
			board.switchTurn();
			board.reset();
			expect(board.getCurrentPlayer()).toBe('X');
		});
	});

	describe('getBoard immutability', () => {
		it('should return a copy, not a reference', () => {
			const boardState = board.getBoard();
			boardState[0] = 'MODIFIED';
			expect(board.getBoard()[0]).toBe(null); // Internal state should be unchanged
		});
	});
});
