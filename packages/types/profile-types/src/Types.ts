import { z } from "zod";
import * as schema from "./Validation";

export type UserData			= z.infer<typeof schema.UserDataSchema>;
export type UserSettings	= z.infer<typeof schema.UserSettingsSchema>;