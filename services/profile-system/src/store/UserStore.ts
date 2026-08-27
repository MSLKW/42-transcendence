import { UserData, UserSettings } from "../types";

export interface UserStore
{
	getUserData(uuid: string):		Promise<UserData | null>;
	getUserSettings(uuid: string):	Promise<UserSettings | null>;
	getUuidsByQuery(query: string):	Promise<string[]>;
	
	updateUserProfile(uuid: string, partial: Partial<UserData>):		Promise<void>;
	updateUserSettings(uuid: string, partial: Partial<UserSettings>):	Promise<void>;
}