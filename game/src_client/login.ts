
const loginButton = document.getElementById("login");
const playerId = document.getElementById('player-id') as HTMLInputElement;

const url = new URL('game.html', window.location.href);
loginButton?.addEventListener('click', () => {
	url.searchParams.set('id', playerId.value);
	window.location.href = url.href;
});