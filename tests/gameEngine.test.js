/**
 * Game Engine Tests
 * Tests for src/lib/gameEngine.js
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { gameEngine } from '$lib/gameEngine.js';
import { get } from 'svelte/store';
import {
	board,
	currentPlayer,
	gameStatus,
	difficulty,
	gameStarted,
	aiThinking,
	winningCombination
} from '$lib/stores.js';

describe('GameEngine', () => {
	beforeEach(() => {
		// Reset game state before each test
		gameEngine.resetGame();
	});

	describe('initializeGame', () => {
		it('should initialize with empty board', () => {
			gameEngine.initializeGame('HARD');
			expect(get(board)).toEqual(Array(9).fill(null));
		});

		it('should set correct difficulty', () => {
			gameEngine.initializeGame('EASY');
			expect(get(difficulty)).toBe('EASY');

			gameEngine.initializeGame('HARD');
			expect(get(difficulty)).toBe('HARD');
		});

		it('should set gameStarted to true', () => {
			gameEngine.initializeGame('HARD');
			expect(get(gameStarted)).toBe(true);
		});

		it('should set currentPlayer to X', () => {
			gameEngine.initializeGame('HARD');
			expect(get(currentPlayer)).toBe('X');
		});

		it('should set gameStatus to ONGOING', () => {
			gameEngine.initializeGame('HARD');
			expect(get(gameStatus)).toBe('ONGOING');
		});

		it('should clear winningCombination', () => {
			gameEngine.initializeGame('HARD');
			expect(get(winningCombination)).toBe(null);
		});

		it('should set aiThinking to false', () => {
			gameEngine.initializeGame('HARD');
			expect(get(aiThinking)).toBe(false);
		});
	});

	describe('handlePlayerMove', () => {
		beforeEach(() => {
			gameEngine.initializeGame('HARD');
		});

		it('should place X on valid empty cell', () => {
			const result = gameEngine.handlePlayerMove(0, 0);
			expect(result).toBe(true);
			expect(get(board)[0]).toBe('X');
		});

		it('should reject move on occupied cell', () => {
			gameEngine.handlePlayerMove(0, 0);
			// Wait for AI to move, then try occupied cell again
			// For now, just test the immediate rejection
			const initialBoard = [...get(board)];
			initialBoard[4] = 'X'; // Pretend position 4 is occupied
			// Direct board manipulation for test
		});

		it('should return false for out of bounds move', () => {
			const result = gameEngine.handlePlayerMove(3, 0);
			expect(result).toBe(false);
		});

		it('should switch turn after valid move', async () => {
			expect(get(currentPlayer)).toBe('X');
			gameEngine.handlePlayerMove(0, 0);
			// After player move, it becomes AI's turn
			expect(get(currentPlayer)).toBe('O');
		});
	});

	describe('handlePlayerMoveByIndex', () => {
		beforeEach(() => {
			gameEngine.initializeGame('HARD');
		});

		it('should convert index to coordinates and place move', () => {
			const result = gameEngine.handlePlayerMoveByIndex(4);
			expect(result).toBe(true);
			expect(get(board)[4]).toBe('X');
		});
	});

	describe('resetGame', () => {
		it('should clear board', () => {
			gameEngine.initializeGame('HARD');
			gameEngine.handlePlayerMove(0, 0);
			gameEngine.resetGame();
			expect(get(board)).toEqual(Array(9).fill(null));
		});

		it('should set gameStarted to false', () => {
			gameEngine.initializeGame('HARD');
			gameEngine.resetGame();
			expect(get(gameStarted)).toBe(false);
		});

		it('should set gameStatus to ONGOING', () => {
			gameEngine.initializeGame('HARD');
			gameEngine.resetGame();
			expect(get(gameStatus)).toBe('ONGOING');
		});

		it('should clear winningCombination', () => {
			gameEngine.initializeGame('HARD');
			gameEngine.resetGame();
			expect(get(winningCombination)).toBe(null);
		});

		it('should reset currentPlayer to X', () => {
			gameEngine.initializeGame('HARD');
			gameEngine.handlePlayerMove(0, 0);
			gameEngine.resetGame();
			expect(get(currentPlayer)).toBe('X');
		});
	});

	describe('setDifficulty', () => {
		it('should change difficulty before game starts', () => {
			gameEngine.resetGame();
			const result = gameEngine.setDifficulty('EASY');
			expect(result).toBe(true);
			expect(get(difficulty)).toBe('EASY');
		});

		it('should reject difficulty change after game starts', () => {
			gameEngine.initializeGame('HARD');
			const result = gameEngine.setDifficulty('EASY');
			expect(result).toBe(false);
			expect(get(difficulty)).toBe('HARD');
		});
	});

	describe('game flow', () => {
		it('should not allow moves when game is over', () => {
			gameEngine.initializeGame('HARD');
			// Force game over
			gameEngine.board.setStatus('PLAYER_WON');
			gameEngine.syncStores();

			const result = gameEngine.handlePlayerMove(0, 0);
			expect(result).toBe(false);
		});

		it('should detect player win', () => {
			gameEngine.initializeGame('EASY');

			// Manually set up a winning position for testing
			// This is a simplified test - in real game AI would have moved
			gameEngine.board.placeMoveByIndex(0, 'X');
			gameEngine.board.placeMoveByIndex(3, 'O');
			gameEngine.board.placeMoveByIndex(1, 'X');
			gameEngine.board.placeMoveByIndex(4, 'O');
			gameEngine.board.placeMoveByIndex(2, 'X'); // X wins

			// Check game end manually
			gameEngine.checkGameEnd();

			expect(get(gameStatus)).toBe('PLAYER_WON');
			expect(get(winningCombination)).toEqual([0, 1, 2]);
		});

		it('should detect AI win', () => {
			gameEngine.initializeGame('EASY');

			// Set up AI winning position
			gameEngine.board.placeMoveByIndex(0, 'O');
			gameEngine.board.placeMoveByIndex(1, 'X');
			gameEngine.board.placeMoveByIndex(3, 'O');
			gameEngine.board.placeMoveByIndex(2, 'X');
			gameEngine.board.placeMoveByIndex(6, 'O'); // O wins column

			gameEngine.checkGameEnd();

			expect(get(gameStatus)).toBe('AI_WON');
			expect(get(winningCombination)).toEqual([0, 3, 6]);
		});

		it('should detect draw', () => {
			gameEngine.initializeGame('EASY');

			// Set up draw position
			// X O X
			// X O O
			// O X X
			const moves = [
				[0, 'X'],
				[1, 'O'],
				[2, 'X'],
				[3, 'X'],
				[4, 'O'],
				[5, 'O'],
				[6, 'O'],
				[7, 'X'],
				[8, 'X']
			];

			for (const [index, player] of moves) {
				gameEngine.board.placeMoveByIndex(index, player);
			}

			gameEngine.checkGameEnd();

			expect(get(gameStatus)).toBe('DRAW');
			expect(get(winningCombination)).toBe(null);
		});
	});

	describe('getState', () => {
		it('should return current game state', () => {
			gameEngine.initializeGame('HARD');
			const state = gameEngine.getState();

			expect(state.board).toEqual(Array(9).fill(null));
			expect(state.currentPlayer).toBe('X');
			expect(state.status).toBe('ONGOING');
			expect(state.difficulty).toBe('HARD');
			expect(state.gameStarted).toBe(true);
			expect(state.aiThinking).toBe(false);
		});
	});
});
