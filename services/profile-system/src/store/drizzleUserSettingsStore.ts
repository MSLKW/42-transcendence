import { postgres } from "postgres";
import { users } from "@big2/auth-schema";
import { userInfo, userSettings } from "@big2/profile-system-schema";
import type { UserSettings } from "@big2/profile-system-types";
import { eq } from "drizzle-orm";


export class DrizzleUserSettingsStore{
	//TODO: put settings into Postgres => setUserSettings()
	async setUserSettings(id: string, settings: UserSettings): Promise<void> {
		await postgres.update(userSettings).set(settings).where(eq(userSettings.id, id));
  }
}
