import cron from "node-cron";
import { SessionStore } from "../store/sessionStore";

const SCHEDULE_STRING = process.env.SESSION_CLEANUP_CRON_SCHEDULE_STRING as string;

export function scheduleSessionCleanup(sessionStore: SessionStore)
{
	cron.schedule(SCHEDULE_STRING, async () =>
	{
		try
		{
			await sessionStore.deleteExpired();
			console.log("[Cron Job] Successfully ran session cleanup")
		}
		catch (err)
		{
			console.error("[Cron Job] Failed to run session cleanup: ", err);
		}
	});	
}