
const loginButton = document.getElementById("login");
const playerId = document.getElementById('player-id') as HTMLInputElement;
const sessionIdInput = document.getElementById('session-id') as HTMLInputElement;

const whitelistInput = document.getElementById('whitelist-input') as HTMLInputElement;
const whitelistButton = document.getElementById('whitelist-button') as HTMLButtonElement;

const createLobbyButton = document.getElementById('create-lobby') as HTMLButtonElement;
const updateLobbyButton = document.getElementById('update-lobby') as HTMLButtonElement;

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
	lobbySessionId: string;
}

interface createLobbyPayload {
	hostUuid: string;
	playersLimit: number;
	playerUuids: Array<string>;
}

createLobbyButton?.addEventListener('click', () => {
	createLobbyAsync().then((result) => {
		sessionId = result.lobbySessionId;
		whitelisted.length = 0;
		console.log(`Received sessionId: ${sessionId}`);
	}).catch((err) => {
		console.log("Failed to create lobby");
	});
});

updateLobbyButton?.addEventListener('click', () => {
	const sessionId = sessionIdInput.value;
	updateLobbyAsync(sessionId).then((result) => {
		console.log(`Updated lobby<${sessionId}>`);
	}).catch((err) => {
		console.log("Failed to update lobby");
	})
});

async function createLobbyAsync(): Promise<createLobbyResponse> {
	const data: createLobbyPayload = {
		hostUuid: playerId.value,
		playersLimit: 4,
		playerUuids: whitelisted
	};
	const response = await fetch("/lobby", {
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

async function updateLobbyAsync(sessionId: string): Promise<string> {
	const data: createLobbyPayload = {
		hostUuid: playerId.value,
		playersLimit: 4,
		playerUuids: whitelisted
	};
	const response = await fetch(`/lobby/${sessionId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		throw new Error(`HTTP Error: ${response.status}`);
	}
	return (await response.text());
}