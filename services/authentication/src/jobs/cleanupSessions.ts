import { sessions } from "@big2/auth-schema";
import cron from 'node-cron';
import { lt } from 'drizzle-orm';
import { postgres } from "../store/postgres";


// The expression is 5 space-separated fields: 
// minute hour day-of-month month day-of-week. 
// */5 * * * * means "every 5 minutes," 
// same as the pg_cron example.
export function startSessionCleanupJob() {
  cron.schedule('*/5 * * * *', async () => {
	try {
	  await postgres
	  	.delete(sessions)
		.where(lt(sessions.expiresAt, new Date()));
	} 
	catch (err) {
	  console.error('Session cleanup job failed:', err);
	}
  });
}