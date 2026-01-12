/**
 * Svelte Stores - Reactive State Management
 * All game state is kept in stores for reactive UI updates.
 *
 * Note: No localStorage/sessionStorage/IndexedDB (RALPH sandbox restriction)
 * State is lost on page refresh - this is expected behavior.
 */

import { writable } from 'svelte/store';

/**
 * Current board state - 9-element array
 * Values: 'X', 'O', or null (empty)
 */
export const board = writable(Array(9).fill(null));

/**
 * Current player's turn
 * Values: 'X' (player) or 'O' (AI)
 * Initialized to 'X' (player always starts)
 */
export const currentPlayer = writable('X');

/**
 * Current game status
 * Values: 'ONGOING', 'PLAYER_WON', 'AI_WON', 'DRAW'
 */
export const gameStatus = writable('ONGOING');

/**
 * AI difficulty level
 * Values: 'EASY' (random) or 'HARD' (minimax)
 */
export const difficulty = writable('HARD');

/**
 * Whether the game has started
 * Used to prevent difficulty changes mid-game
 */
export const gameStarted = writable(false);

/**
 * Whether AI is currently calculating its move
 * Used to lock UI during AI turn
 */
export const aiThinking = writable(false);

/**
 * Winning combination indices (for highlighting)
 * null when no winner, or array of 3 indices
 */
export const winningCombination = writable(null);
