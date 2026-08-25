import { UserData, UserSettings } from "../types";

export interface UserStore
{
	getDataByUuid(uuid: string):									Promise<UserData | null>;
	getUuidsBySearchTerm(searchTerm: string):						Promise<string[]>;
	setUsername(uuid: string, username: string):					Promise<void>;
	setAvatarPath(uuid: string, avatarPath: string):				Promise<void>;
	setSettings(uuid: string, userSettings: UserSettings):			Promise<void>;
	updateUserProfile(uuid: string, partial: Partial<UserData>):	Promise<void>;
	updateSettings(uuid: string, partial: Partial<UserSettings>):	Promise<void>;
}