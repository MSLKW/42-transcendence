// import { UserData, UserSettings } from "../types";
import { type UserData, type UserSettings } from "@big2/profile-types";

export interface UserStore
{
	getUserData(uuid: string):				Promise<UserData | null>;
	getUserSettings(uuid: string):			Promise<UserSettings | null>;
	getUuidsByQuery(query: string):			Promise<string[]>;
	getUuidByUsername(username: string):	Promise<string | null>;
	
	updateUserProfile(uuid: string, partial: Partial<UserData>):		Promise<void>;
	updateUserSettings(uuid: string, partial: Partial<UserSettings>):	Promise<void>;
}