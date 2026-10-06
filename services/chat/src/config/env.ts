export const PORT = process.env.PORT;
export const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
export const SOCKET_CHAT_PATH = process.env.SOCKET_CHAT_PATH;
	  
if (!PORT) 				throw new Error("[Error] PORT not set");
if (!AUTH_SERVICE_URL) 	throw new Error("[Error] AUTH_SERVICE_URL not set");
if (!SOCKET_CHAT_PATH) 	throw new Error("[Error] SOCKET_CHAT_PATH not set");
