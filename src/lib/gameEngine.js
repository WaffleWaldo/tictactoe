/**
 * Game Engine - Orchestrates all game components
 * Manages game flow between Board, Rules, AI, and Stores.
 *
 * Flow:
 * 1. User selects difficulty -> initializeGame()
 * 2. User clicks cell -> handlePlayerMove()
 * 3. If game continues -> handleAIMove() (async with delay)
 * 4. Check win/draw after each move
 * 5. Reset with resetGame()
 */

import { Board } from './board.js';
import { checkWin, getGameResult } from './rules.js';
import { getMove } from './ai.js';
import {
	board,
	currentPlayer,
	gameStatus,
	difficulty,
	gameStarted,
	aiThinking,
	winningCombination
} from './stores.js';
import { get } from 'svelte/store';

class GameEngine {
	constructor() {
		this.board = new Board();
	}

	/**
	 * Sync internal board state to Svelte stores
	 */
	syncStores() {
		board.set(this.board.getBoard());
		currentPlayer.set(this.board.getCurrentPlayer());
		gameStatus.set(this.board.getStatus());
	}

	/**
	 * Initialize a new game with selected difficulty
	 * @param {string} selectedDifficulty - 'EASY' or 'HARD'
	 */
	initializeGame(selectedDifficulty = 'HARD') {
		this.board.initialize();
		difficulty.set(selectedDifficulty);
		gameStarted.set(true);
		aiThinking.set(false);
		winningCombination.set(null);
		this.syncStores();
	}

	/**
	 * Check if game has ended and update status
	 * @returns {boolean} True if game ended
	 */
	checkGameEnd() {
		const boardState = this.board.getBoard();
		const result = getGameResult(boardState);

		if (result !== 'ONGOING') {
			this.board.setStatus(result);

			// If there's a winner, find and store the winning combination
			if (result === 'PLAYER_WON') {
				const combo = checkWin(boardState, 'X');
				winningCombination.set(combo);
			} else if (result === 'AI_WON') {
				const combo = checkWin(boardState, 'O');
				winningCombination.set(combo);
			}

			this.syncStores();
			return true;
		}
		return false;
	}

	/**
	 * Handle player's move
	 * @param {number} row - Row 0-2
	 * @param {number} col - Column 0-2
	 * @returns {boolean} True if move was valid and processed
	 */
	handlePlayerMove(row, col) {
		// Check if game is ongoing
		if (this.board.isGameOver()) {
			return false;
		}

		// Check if it's player's turn
		if (this.board.getCurrentPlayer() !== 'X') {
			return false;
		}

		// Check if AI is thinking
		if (get(aiThinking)) {
			return false;
		}

		// Try to place the move
		if (!this.board.placeMove(row, col, 'X')) {
			return false;
		}

		// Switch turn
		this.board.switchTurn();
		this.syncStores();

		// Check if game ended
		if (this.checkGameEnd()) {
			return true;
		}

		// Trigger AI move
		this.handleAIMove();
		return true;
	}

	/**
	 * Handle player's move by flat index
	 * @param {number} index - Flat index 0-8
	 * @returns {boolean} True if move was valid and processed
	 */
	handlePlayerMoveByIndex(index) {
		const coords = this.board.toCoords(index);
		return this.handlePlayerMove(coords.row, coords.col);
	}

	/**
	 * Handle AI's move (async with delay for natural UX)
	 */
	async handleAIMove() {
		// Check if game is still ongoing
		if (this.board.isGameOver()) {
			return;
		}

		// Check if it's AI's turn
		if (this.board.getCurrentPlayer() !== 'O') {
			return;
		}

		// Lock UI
		aiThinking.set(true);

		// Add delay for natural feel (100-300ms)
		const delay = 100 + Math.random() * 200;
		await new Promise(resolve => setTimeout(resolve, delay));

		// Get AI move based on difficulty
		const currentDifficulty = get(difficulty);
		const boardState = this.board.getBoard();
		const move = getMove(boardState, currentDifficulty);

		if (move !== null) {
			// Place the move
			this.board.placeMoveByIndex(move, 'O');
			this.board.switchTurn();
			this.syncStores();

			// Check if game ended
			this.checkGameEnd();
		}

		// Unlock UI
		aiThinking.set(false);
	}

	/**
	 * Reset game to initial state
	 * Preserves difficulty selection
	 */
	resetGame() {
		this.board.reset();
		gameStarted.set(false);
		aiThinking.set(false);
		winningCombination.set(null);
		this.syncStores();
	}

	/**
	 * Start a new game (convenience method that initializes with current difficulty)
	 */
	startNewGame() {
		const currentDifficulty = get(difficulty);
		this.initializeGame(currentDifficulty);
	}

	/**
	 * Change difficulty (only allowed before game starts)
	 * @param {string} newDifficulty - 'EASY' or 'HARD'
	 * @returns {boolean} True if change was allowed
	 */
	setDifficulty(newDifficulty) {
		if (get(gameStarted)) {
			return false;
		}
		difficulty.set(newDifficulty);
		return true;
	}

	/**
	 * Get current game state (for debugging)
	 */
	getState() {
		return {
			board: this.board.getBoard(),
			currentPlayer: this.board.getCurrentPlayer(),
			status: this.board.getStatus(),
			difficulty: get(difficulty),
			gameStarted: get(gameStarted),
			aiThinking: get(aiThinking)
		};
	}
}

// Export singleton instance
export const gameEngine = new GameEngine();
