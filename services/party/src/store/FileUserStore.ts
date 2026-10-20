import { UserData, UserStore } from "./UserStore";
import fs from "fs";
import path from "path";

const DATA_DIR = "./data/users";

if (!fs.existsSync(DATA_DIR))
	fs.mkdirSync(DATA_DIR, { recursive: true });

export class FileUserStore implements UserStore
{
	private filePath(uuid: string)
	{
		return path.join(DATA_DIR, `${uuid}.json`);
	}

	async setUser(user: UserData): Promise<void>
	{
		await fs.promises.writeFile(this.filePath(user.uuid), JSON.stringify(user, null, 2));
	}

	async getUser(uuid: string): Promise<UserData | null>
	{
		try
		{
			const raw = await fs.promises.readFile(this.filePath(uuid), "utf-8");
			const parsed = JSON.parse(raw) as UserData;

			return parsed;	
		}
		catch (err: any)
		{
			if (err.code === "ENOENT")
				return null;
			throw err;	
		}

	}
}