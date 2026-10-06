export const PORT = process.env.PORT;
export const SESSION_DURATION_MS = process.env.SESSION_DURATION_MS;
export const SESSION_CLEANUP_CRON_SCHEDULE_STRING = process.env.SESSION_CLEANUP_CRON_SCHEDULE_STRING;
export const PROFILE_SERVICE_URL = process.env.PROFILE_SERVICE_URL;
	  
if (!PORT)						 			throw new Error("[Error] PORT not set");
if (!SESSION_DURATION_MS) 					throw new Error("[Error] SESSION_DURATION_MS not set");
if (!SESSION_CLEANUP_CRON_SCHEDULE_STRING)	throw new Error("[Error] SESSION_CLEANUP_CRON_SCHEDULE_STRING not set");
if (!PROFILE_SERVICE_URL) 					throw new Error("[Error] PROFILE_SERVICE_URL not set");
