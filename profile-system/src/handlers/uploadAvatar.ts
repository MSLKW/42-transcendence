import { Request, Response } from "express";
import { AVATAR_DIR } from "../config";
import { authenticate } from "../utils/authenticate";
import multer from "multer";
import path from "path";
import fs from "fs";

if (!fs.existsSync(AVATAR_DIR))
	fs.mkdirSync(AVATAR_DIR, {recursive: true});

const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "image/jpg"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const fileFilter = (_req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) =>
{
	if (ALLOWED_MIME_TYPES.includes(file.mimetype)) 
		callback(null, true);
	else
		callback(new Error(`Only [${ALLOWED_MIME_TYPES}] allowed`));
};

const multerUpload = multer({
	storage: multer.memoryStorage(),
	fileFilter: fileFilter,
	limits: { fileSize: MAX_FILE_SIZE },
}).single('avatar');

export function uploadAvatar()
{
	return (async (req: Request, res: Response) =>
	{
		try
		{
			const authRes = await authenticate(req);
			const data = await authRes.json();
			if (!authRes.ok)
				return (res.status(authRes.status).json(data));
			multerUpload(req, res, async (err: unknown) =>
			{
				if (err)
				{
					const message = err instanceof Error ? err.message : "Upload failed";
					return (res.status(400).json({ error: message }));
				}
				if (!req.file)
					return (res.status(400).json({error: "No file uploaded"}));

				const ext = path.extname(req.file.originalname).toLowerCase();
				const filePath = path.join(AVATAR_DIR, `${data.userId}${ext}`);

				try
				{
					await fs.promises.writeFile(filePath, req.file.buffer);
					return (res.status(204).send());
				}
				catch (writeErr)
				{
					console.error(["[Error] uploadAvatar:", writeErr);
					return (res.status(500).json({error: "Failed to save file"}));
				}
			});
		}
		catch (err)
		{
			console.error("[Error] uploadAvatar error")
			return (res.status(500).json({error: "Something went wrong"}));
		}
	});
}