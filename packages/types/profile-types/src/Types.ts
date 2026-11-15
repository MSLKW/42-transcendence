import { z } from "zod";
import * as schema from "./Validation";

export type UserData		= Required<z.infer<typeof schema.UserDataSchema>>;
export type UserSettings	= Required<z.infer<typeof schema.UserSettingsSchema>>;