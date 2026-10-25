import { CHAT_SERVICE_URL } from "../config/env"

export async function postChatWhitelist(hostUuid: string, playerUuids: string[])
{
	try
	{
		const response = await fetch(`${CHAT_SERVICE_URL}/party`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				hostUuid: hostUuid,
				playerUuids: [...playerUuids]
			})
		});
	}
	catch (err)
	{
		console.error("call to chat failed", err);
	}
}

export async function putChatWhitelist(oldHostUuid: string, newHostUuid: string, playerUuids: string[])
{
	try
	{
		const response = await fetch(`${CHAT_SERVICE_URL}/party/${oldHostUuid}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				hostUuid: newHostUuid,
				playerUuids: [...playerUuids]
			})
		});
	}
	catch (err)
	{
		console.error("call to chat failed", err);
	}
}

export async function deleteChatWhitelist(hostUuid: string)
{
	try
	{
		const response = await fetch(`${CHAT_SERVICE_URL}/party/${hostUuid}`, {
			method: "DELETE",
		});
	}
	catch (err)
	{
		console.error("call to chat failed", err);
	}
}