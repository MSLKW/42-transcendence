
const loginButton = document.getElementById("login");
const playerId = document.getElementById('player-id') as HTMLInputElement;
const sessionIdInput = document.getElementById('session-id') as HTMLInputElement;

const whitelistInput = document.getElementById('whitelist-input') as HTMLInputElement;
const whitelistButton = document.getElementById('whitelist-button') as HTMLButtonElement;

const createLobbyButton = document.getElementById('create-lobby') as HTMLButtonElement;

let sessionId: string = "";

const url = new URL('game.html', window.location.href);
loginButton?.addEventListener('click', () => {
	url.searchParams.set('id', playerId.value);
	if (sessionIdInput.value)
		sessionId = sessionIdInput.value; 
	url.searchParams.set('sessionId', sessionId);
	window.location.href = url.href;
});

const whitelisted: Array<string> = [];

whitelistButton?.addEventListener('click', () => {
	const whitelistedUUID = whitelistInput.value;
	whitelistInput.value = "";
	whitelisted.push(whitelistedUUID);
	console.log(`Successfully added ${whitelistedUUID} to whitelist`);
})

interface createLobbyResponse {
	sessionId: string;
}

interface createLobbyPayload {
	hostUuid: string;
	playersLimit: number;
	whitelist: Array<string>;
}

createLobbyButton?.addEventListener('click', () => {
	createLobbyAsync().then((result) => {
		sessionId = result.sessionId;
		console.log(`Received sessionId: ${sessionId}`);
	}).catch((err) => {
		console.log("Failed to create lobby");
	});
});

async function createLobbyAsync(): Promise<createLobbyResponse> {
	const data: createLobbyPayload = {
		hostUuid: playerId.value,
		playersLimit: 4,
		whitelist: whitelisted
	};
	const response = await fetch("/api/game/lobby", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		throw new Error(`HTTP Error: ${response.status}`);
	}
	const result: createLobbyResponse = await response.json();
	return (result);
}