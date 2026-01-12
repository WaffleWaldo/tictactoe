<script>
	import { gameEngine } from '$lib/gameEngine.js';
	import {
		board,
		currentPlayer,
		gameStatus,
		difficulty,
		gameStarted,
		aiThinking,
		winningCombination
	} from '$lib/stores.js';

	/**
	 * Handle cell click
	 * @param {number} index - Cell index 0-8
	 */
	function handleCellClick(index) {
		// Prevent clicks during AI turn or after game ends
		if ($aiThinking || $gameStatus !== 'ONGOING') {
			return;
		}
		gameEngine.handlePlayerMoveByIndex(index);
	}

	/**
	 * Handle difficulty change
	 * @param {string} newDifficulty - 'EASY' or 'HARD'
	 */
	function handleDifficultyChange(newDifficulty) {
		if (!$gameStarted) {
			difficulty.set(newDifficulty);
		}
	}

	/**
	 * Start or restart the game
	 */
	function startGame() {
		gameEngine.initializeGame($difficulty);
	}

	/**
	 * Reset to difficulty selection
	 */
	function playAgain() {
		gameEngine.resetGame();
	}

	/**
	 * Check if cell is part of winning combination
	 * @param {number} index - Cell index
	 */
	function isWinningCell(index) {
		return $winningCombination && $winningCombination.includes(index);
	}

	/**
	 * Get status message
	 */
	function getStatusMessage() {
		if ($gameStatus === 'PLAYER_WON') return 'You Win!';
		if ($gameStatus === 'AI_WON') return 'AI Wins!';
		if ($gameStatus === 'DRAW') return "It's a Draw!";
		if ($aiThinking) return 'AI is thinking...';
		if ($currentPlayer === 'X') return 'Your turn (X)';
		return 'AI turn (O)';
	}
</script>

<main>
	<h1>Tic-Tac-Toe</h1>

	{#if !$gameStarted}
		<!-- Difficulty Selection Screen -->
		<div class="difficulty-screen">
			<h2>Select Difficulty</h2>
			<div class="difficulty-buttons">
				<button
					class="difficulty-btn"
					class:selected={$difficulty === 'EASY'}
					onclick={() => handleDifficultyChange('EASY')}
				>
					Easy
				</button>
				<button
					class="difficulty-btn"
					class:selected={$difficulty === 'HARD'}
					onclick={() => handleDifficultyChange('HARD')}
				>
					Hard
				</button>
			</div>
			<p class="difficulty-description">
				{#if $difficulty === 'EASY'}
					AI makes random moves. You can easily win!
				{:else}
					AI plays optimally. Can you beat it?
				{/if}
			</p>
			<button class="start-btn" onclick={startGame}>Start Game</button>
		</div>
	{:else}
		<!-- Game Screen -->
		<div class="game-screen">
			<div class="info-bar">
				<span class="difficulty-badge">{$difficulty}</span>
				<span class="status">{getStatusMessage()}</span>
			</div>

			<div class="board">
				{#each $board as cell, index}
					<button
						class="cell"
						class:x={cell === 'X'}
						class:o={cell === 'O'}
						class:winning={isWinningCell(index)}
						class:clickable={cell === null && $gameStatus === 'ONGOING' && !$aiThinking}
						onclick={() => handleCellClick(index)}
						disabled={$aiThinking || $gameStatus !== 'ONGOING'}
					>
						{cell || ''}
					</button>
				{/each}
			</div>

			{#if $gameStatus !== 'ONGOING'}
				<!-- Game End Overlay -->
				<div class="game-end-overlay">
					<div class="game-end-content">
						<h2 class="result-text" class:win={$gameStatus === 'PLAYER_WON'} class:lose={$gameStatus === 'AI_WON'}>
							{#if $gameStatus === 'PLAYER_WON'}
								You Win!
							{:else if $gameStatus === 'AI_WON'}
								AI Wins!
							{:else}
								It's a Draw!
							{/if}
						</h2>
						<button class="play-again-btn" onclick={playAgain}>Play Again</button>
					</div>
				</div>
			{/if}

			<button class="reset-btn" onclick={playAgain}>Reset Game</button>
		</div>
	{/if}
</main>

<style>
	:global(body) {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
		background: #1a1a2e;
		color: #eee;
		min-height: 100vh;
	}

	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20px;
		min-height: 100vh;
		box-sizing: border-box;
	}

	h1 {
		font-size: 2.5rem;
		margin-bottom: 20px;
		color: #fff;
	}

	/* Difficulty Selection */
	.difficulty-screen {
		text-align: center;
	}

	.difficulty-screen h2 {
		font-size: 1.5rem;
		margin-bottom: 20px;
		color: #ccc;
	}

	.difficulty-buttons {
		display: flex;
		gap: 20px;
		justify-content: center;
		margin-bottom: 20px;
	}

	.difficulty-btn {
		padding: 15px 40px;
		font-size: 1.2rem;
		border: 2px solid #4a4a6a;
		background: #2a2a4a;
		color: #fff;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.difficulty-btn:hover {
		background: #3a3a5a;
		border-color: #6a6a8a;
	}

	.difficulty-btn.selected {
		background: #4a4a8a;
		border-color: #7a7aff;
	}

	.difficulty-description {
		color: #888;
		margin-bottom: 30px;
		font-size: 1rem;
	}

	.start-btn {
		padding: 15px 60px;
		font-size: 1.3rem;
		background: #4a7aff;
		color: #fff;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: background 0.2s;
	}

	.start-btn:hover {
		background: #3a6aee;
	}

	/* Game Screen */
	.game-screen {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.info-bar {
		display: flex;
		align-items: center;
		gap: 20px;
		margin-bottom: 20px;
	}

	.difficulty-badge {
		padding: 5px 15px;
		background: #4a4a6a;
		border-radius: 20px;
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.status {
		font-size: 1.2rem;
		color: #ccc;
	}

	/* Game Board */
	.board {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 10px;
		background: #2a2a4a;
		padding: 10px;
		border-radius: 10px;
		margin-bottom: 20px;
	}

	.cell {
		width: 100px;
		height: 100px;
		font-size: 3rem;
		font-weight: bold;
		border: none;
		background: #3a3a5a;
		color: #fff;
		border-radius: 8px;
		cursor: default;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.cell.clickable {
		cursor: pointer;
	}

	.cell.clickable:hover {
		background: #4a4a6a;
	}

	.cell.x {
		color: #5aafff;
	}

	.cell.o {
		color: #ff5a5a;
	}

	.cell.winning {
		background: #4a6a4a;
		animation: pulse 0.5s ease-in-out infinite alternate;
	}

	@keyframes pulse {
		from {
			transform: scale(1);
		}
		to {
			transform: scale(1.05);
		}
	}

	.cell:disabled {
		opacity: 0.8;
	}

	/* Game End Overlay */
	.game-end-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.8);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
	}

	.game-end-content {
		text-align: center;
		background: #2a2a4a;
		padding: 40px 60px;
		border-radius: 15px;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
	}

	.result-text {
		font-size: 2.5rem;
		margin-bottom: 30px;
		color: #ccc;
	}

	.result-text.win {
		color: #5aff5a;
	}

	.result-text.lose {
		color: #ff5a5a;
	}

	.play-again-btn {
		padding: 15px 50px;
		font-size: 1.2rem;
		background: #4a7aff;
		color: #fff;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: background 0.2s;
	}

	.play-again-btn:hover {
		background: #3a6aee;
	}

	.reset-btn {
		padding: 10px 30px;
		font-size: 1rem;
		background: transparent;
		color: #888;
		border: 1px solid #4a4a6a;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.reset-btn:hover {
		background: #3a3a5a;
		color: #ccc;
	}

	/* Responsive */
	@media (max-width: 400px) {
		.cell {
			width: 80px;
			height: 80px;
			font-size: 2.5rem;
		}

		h1 {
			font-size: 2rem;
		}
	}
</style>
