/**
 * Board State Management
 * Maintains the current state of the 3x3 tic-tac-toe game board.
 *
 * Coordinate system:
 * - (row, col): row 0-2 top-to-bottom, col 0-2 left-to-right
 * - Flat index: 0-8 left-to-right, top-to-bottom
 *
 * Game status values: 'ONGOING', 'PLAYER_WON', 'AI_WON', 'DRAW'
 * Player symbol: 'X' (always goes first)
 * AI symbol: 'O' (always goes second)
 */

export class Board {
	constructor() {
		this.cells = null;
		this.currentPlayer = null;
		this.status = null;
		this.initialize();
	}

	/**
	 * Initialize board to empty state
	 */
	initialize() {
		this.cells = Array(9).fill(null);
		this.currentPlayer = 'X';
		this.status = 'ONGOING';
	}

	/**
	 * Reset board to initial empty state
	 */
	reset() {
		this.initialize();
	}

	/**
	 * Convert (row, col) coordinates to flat index
	 * @param {number} row - Row 0-2
	 * @param {number} col - Column 0-2
	 * @returns {number} Flat index 0-8
	 */
	toIndex(row, col) {
		return row * 3 + col;
	}

	/**
	 * Convert flat index to (row, col) coordinates
	 * @param {number} index - Flat index 0-8
	 * @returns {{row: number, col: number}} Coordinates object
	 */
	toCoords(index) {
		return {
			row: Math.floor(index / 3),
			col: index % 3
		};
	}

	/**
	 * Check if coordinates are within bounds
	 * @param {number} row - Row coordinate
	 * @param {number} col - Column coordinate
	 * @returns {boolean} True if valid
	 */
	isValid(row, col) {
		return row >= 0 && row <= 2 && col >= 0 && col <= 2;
	}

	/**
	 * Get cell contents by coordinates
	 * @param {number} row - Row 0-2
	 * @param {number} col - Column 0-2
	 * @returns {string|null} 'X', 'O', or null (empty)
	 */
	getCell(row, col) {
		if (!this.isValid(row, col)) {
			return undefined;
		}
		return this.cells[this.toIndex(row, col)];
	}

	/**
	 * Get cell contents by flat index
	 * @param {number} index - Flat index 0-8
	 * @returns {string|null} 'X', 'O', or null (empty)
	 */
	getCellByIndex(index) {
		if (index < 0 || index > 8) {
			return undefined;
		}
		return this.cells[index];
	}

	/**
	 * Check if cell is empty
	 * @param {number} row - Row 0-2
	 * @param {number} col - Column 0-2
	 * @returns {boolean} True if empty
	 */
	isEmpty(row, col) {
		if (!this.isValid(row, col)) {
			return false;
		}
		return this.cells[this.toIndex(row, col)] === null;
	}

	/**
	 * Check if cell is occupied
	 * @param {number} row - Row 0-2
	 * @param {number} col - Column 0-2
	 * @returns {boolean} True if contains X or O
	 */
	isOccupied(row, col) {
		if (!this.isValid(row, col)) {
			return false;
		}
		return this.cells[this.toIndex(row, col)] !== null;
	}

	/**
	 * Check if all 9 cells are occupied
	 * @returns {boolean} True if full
	 */
	isFull() {
		return this.cells.every(cell => cell !== null);
	}

	/**
	 * Get list of available (empty) move indices
	 * @returns {number[]} Array of empty cell indices
	 */
	getAvailableMoves() {
		const moves = [];
		for (let i = 0; i < 9; i++) {
			if (this.cells[i] === null) {
				moves.push(i);
			}
		}
		return moves;
	}

	/**
	 * Place a move on the board
	 * @param {number} row - Row 0-2
	 * @param {number} col - Column 0-2
	 * @param {string} player - 'X' or 'O'
	 * @returns {boolean} True if move was placed successfully
	 */
	placeMove(row, col, player) {
		if (!this.isValid(row, col)) {
			return false;
		}
		if (!this.isEmpty(row, col)) {
			return false;
		}
		if (player !== 'X' && player !== 'O') {
			return false;
		}
		this.cells[this.toIndex(row, col)] = player;
		return true;
	}

	/**
	 * Place a move by flat index
	 * @param {number} index - Flat index 0-8
	 * @param {string} player - 'X' or 'O'
	 * @returns {boolean} True if move was placed successfully
	 */
	placeMoveByIndex(index, player) {
		const coords = this.toCoords(index);
		return this.placeMove(coords.row, coords.col, player);
	}

	/**
	 * Get current player's turn
	 * @returns {string} 'X' or 'O'
	 */
	getCurrentPlayer() {
		return this.currentPlayer;
	}

	/**
	 * Switch turn to other player
	 */
	switchTurn() {
		this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
	}

	/**
	 * Get player symbol (always 'X')
	 * @returns {string} 'X'
	 */
	getPlayerSymbol() {
		return 'X';
	}

	/**
	 * Get AI symbol (always 'O')
	 * @returns {string} 'O'
	 */
	getAISymbol() {
		return 'O';
	}

	/**
	 * Get current game status
	 * @returns {string} 'ONGOING', 'PLAYER_WON', 'AI_WON', or 'DRAW'
	 */
	getStatus() {
		return this.status;
	}

	/**
	 * Set game status
	 * @param {string} status - 'ONGOING', 'PLAYER_WON', 'AI_WON', or 'DRAW'
	 */
	setStatus(status) {
		this.status = status;
	}

	/**
	 * Check if game is over
	 * @returns {boolean} True if game ended
	 */
	isGameOver() {
		return this.status !== 'ONGOING';
	}

	/**
	 * Get immutable copy of board state
	 * @returns {Array<string|null>} Copy of cells array
	 */
	getBoard() {
		return [...this.cells];
	}
}
