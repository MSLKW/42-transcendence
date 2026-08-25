import { UserStore } from "./UserStore";
import { UserData, UserSettings, NULL_ACHIEVEMENTS } from "../types";
import fs from "fs";
import path from "path";

const DATA_DIR = "./data/users";

if (!fs.existsSync(DATA_DIR))
	fs.mkdirSync(DATA_DIR, { recursive: true });

export class FileUserStore implements UserStore
{
	private getFilePath(uuid: string): string
	{
		return path.join(DATA_DIR, `${uuid}.json`);
	}

	async getDataByUuid(uuid: string): Promise<UserData | null>
	{
		try
		{
			const raw = await fs.promises.readFile(this.getFilePath(uuid), "utf-8");
			return (JSON.parse(raw) as UserData);
		}
		catch (err: any)
		{
			if (err.code === "ENOENT")
				return (null);
			throw (err);
		}
	}

	async getUuidsBySearchTerm(searchTerm: string): Promise<string[]>
	{
		const files = await fs.promises.readdir(DATA_DIR);
		const jsonFiles = files.filter(f => f.endsWith(".json"));

		const matches = await Promise.all(
			jsonFiles.map(async (file) => {
				const uuid = path.basename(file, ".json");
				const data = await this.getDataByUuid(uuid);
				return (data?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ? uuid : null);
			})
		);

		return (matches.filter((uuid): uuid is string => uuid !== null));
	}

	async setUsername(uuid: string, username: string): Promise<void>
	{
		try
		{
			await this.updateData(uuid, { username: username });
		}
		catch (err)
		{
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

			const userData: UserData = {
				uuid:			uuid,
				username:		username,
				avatarPath:		"",
				settings:		userSettings,
				badge:			"Beginner's Luck",
				level:			0,
				xp:				0,
				createdAt:		new Date(),
				lastLogin:		new Date(),
				totalPlayed:	0,
				totalWins:		0,
				totalLoss:		0,
				winStreak:		0,
				achievements:	structuredClone(NULL_ACHIEVEMENTS),
				online:			false,
				inGame:			false
			};
			await this.setData(uuid, userData);
		}
	}

	async setAvatarPath(uuid: string, avatarPath: string): Promise<void>
	{
		await this.updateData(uuid, { avatarPath: avatarPath });
	}

	async setSettings(uuid: string, userSettings: UserSettings): Promise<void>
	{
		await this.updateData(uuid, { settings: userSettings });
	}

	private async updateData(uuid: string, partial: Partial<UserData>): Promise<void>
	{
		const existing = await this.getDataByUuid(uuid);
		if (!existing)
			throw new Error(`No user data found for uuid: ${uuid}`);

		await this.setData(uuid, { ...existing, ...partial });
	}

	private async setData(uuid: string, userData: UserData): Promise<void>
	{
		await fs.promises.writeFile(
			this.getFilePath(uuid),
			JSON.stringify(userData, null, 2),
			"utf-8"
		);
	}
}