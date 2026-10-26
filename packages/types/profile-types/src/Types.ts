import { z } from "zod";
import * as schema from "./Validation";

export type UserData			= z.infer<typeof schema.UserDataSchema>;
export type UserGameSettings	= z.infer<typeof schema.UserGameSettingsSchema>;