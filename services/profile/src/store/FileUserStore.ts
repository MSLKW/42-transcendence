import { UserStore } from "./UserStore";
import { type UserData, type UserSettings, NULL_ACHIEVEMENTS } from "@big2/profile-types";
import fs from "fs";
import path from "path";

const DATA_DIR = "./data/users";

if (!fs.existsSync(DATA_DIR))
	fs.mkdirSync(DATA_DIR, { recursive: true });

export class FileUserStore implements UserStore
{
	async getUserData(uuid: string): Promise<UserData | null>
	{
		try
		{
			const raw = JSON.parse(await fs.promises.readFile(this.getFilePath(uuid), "utf-8")) as UserData;
			const userData: UserData = {
				username:		raw.username,
				avatarPath:		raw.avatarPath,
				badge:			raw.badge,
			};
			return (userData);
		}
		catch (err: any)
		{
			if (err.code === "ENOENT")
				return (null);
			throw (err);
		}
	}

	async getUserSettings(uuid: string): Promise<UserSettings | null>
	{
		try
		{
			const raw = JSON.parse(await fs.promises.readFile(this.getFilePath(uuid), "utf-8")) as UserSettings;
			const userSettings: UserSettings = {
				allow3OfAKind:		raw.allow3OfAKind,
				allow2OfSpadesEnd:	raw.allow2OfSpadesEnd,
				autoPassIndex:		raw.autoPassIndex,
				endGameCondition:	raw.endGameCondition,
				scoreCalculation:	raw.scoreCalculation,
				cardStyle:			raw.cardStyle,
				uiColor:			raw.uiColor,
				fxLevel:			raw.fxLevel,
				mxLevel:			raw.mxLevel
			};
			return (userSettings);
		}
		catch (err: any)
		{
			if (err.code === "ENOENT")
				return (null);
			throw (err);
		}
	}

	async getUuidsByQuery(query: string): Promise<string[]>
	{
		const files = await fs.promises.readdir(DATA_DIR);
		const jsonFiles = files.filter(f => f.endsWith(".json"));

		const matches = await Promise.all(
			jsonFiles.map(async (file) => {
				const uuid = path.basename(file, ".json");
				const data = await this.getUserData(uuid);
				return (data?.username?.toLowerCase().includes(query.toLowerCase()) ? uuid : null);
			})
		);
		return (matches.filter((uuid): uuid is string => uuid !== null));
	}

	async getUuidByUsername(username: string): Promise<string | null>
	{
		const files = await fs.promises.readdir(DATA_DIR);
		const jsonFiles = files.filter(f => f.endsWith(".json"));
		
		for (const file of jsonFiles)
		{
			const uuid = path.basename(file, ".json");
			const data = await this.getUserData(uuid);
			if (data?.username === username)
				return (uuid);
		}
		return null;
	}

	async updateUserProfile(uuid: string, partial: Partial<UserData>): Promise<void>
	{
		let existing = await this.getUserData(uuid);
		if (!existing)
			await this.createUser(uuid);
		existing = await this.getUserData(uuid);
		await this.setData(uuid, { ...existing!, ...partial }, (await this.getUserSettings(uuid))!);
	}

	async updateUserSettings(uuid: string, partial: Partial<UserSettings>): Promise<void>
	{
		let existing = await this.getUserSettings(uuid);
		if (!existing)
			await this.createUser(uuid);
		existing = await this.getUserSettings(uuid);
		await this.setData(uuid, (await this.getUserData(uuid))!, { ...existing!, ...partial });
	}

	private async createUser(uuid: string)
	{
		const userData: UserData = {
			username:		null,
			avatarPath:		null,
			badge:			"Beginner's Luck",
		};
		
		const userSettings: UserSettings = {
			allow3OfAKind:		true,
			allow2OfSpadesEnd:	true,
			autoPassIndex:		0,
			endGameCondition:	0,
			scoreCalculation:	0,
			cardStyle:			0,
			uiColor:			0,
			fxLevel:			0,
			mxLevel:			0
			};

		await this.setData(uuid, userData, userSettings);
	}

	private async setData(uuid: string, userData: UserData, userSettings: UserSettings): Promise<void>
	{
		const union: UserData & UserSettings = {...userData, ...userSettings};

		if (union.username)
		{
			const existingUsername = await this.getUuidByUsername(union.username);
			if (existingUsername && existingUsername != uuid)
				throw new Error("DUPLICATE_USERNAME");
		}

		await fs.promises.writeFile(
			this.getFilePath(uuid),
			JSON.stringify(union),
			"utf-8"
		);
	}
	
	private getFilePath(uuid: string): string
	{
		return path.join(DATA_DIR, `${uuid}.json`);
	}
}