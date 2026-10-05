// export const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

export const PORT = 3000;

export const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
if (!AUTH_SERVICE_URL)
	throw new Error("[Error] AUTH_SERVICE_URL not set");

// TODO: have WEBSITE'S url check and throw here too if its used within CORS middleware at index.ts