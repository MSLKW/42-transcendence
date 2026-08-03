import { Request, Response } from "express";
import { AUTH_SERVICE_URL, AVATAR_DIR } from "../config";
import multer from "multer";
import path from "path";
import fs from "fs";

if (!fs.existsSync(AVATAR_DIR))
	fs.mkdirSync(AVATAR_DIR, {recursive: true});

const ALLOWED_MIME_TYPES = ["image/png"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		cb(null, AVATAR_DIR);
	},
	filename: (req, file, cb) => {
		const { uuid } = req.params;
		const ext = path.extname(file.originalname).toLowerCase();
		cb(null, `${uuid}${ext}`);
	},
});

const fileFilter = (_req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) =>
{
	if (ALLOWED_MIME_TYPES.includes(file.mimetype)) 
		callback(null, true);
	else
		callback(new Error('Only PNG images are allowed'));
};

const multerUpload = multer({
	storage,
	fileFilter,
	limits: { fileSize: MAX_FILE_SIZE },
}).single('avatar');

export function uploadAvatar()
{
	return (async (req: Request, res: Response) =>
	{
		try
		{
			const authRes = await fetch(`${AUTH_SERVICE_URL}/validate`, {
				headers: {
					Cookie: req.headers.cookie || "",
					Authorization: req.get("Authorization") || ""
				}
			});
			const data = await authRes.json();
			if (!authRes.ok)
				return (res.status(authRes.status).json(data));
			multerUpload(req, res, (err: unknown) =>
			{
				if (err)
				{
					const message = err instanceof Error ? err.message : 'Upload failed';
					return (res.status(400).json({ error: message }));
				}
				if (!req.file)
				{
					res.status(400).json({ error: 'No file uploaded' });
					return;
				}
				return (res.status(204));
			});
		}
		catch (err)
		{
			console.error("")
			return (res.status(500).json({error: "Something went wrong"}));
		}
	});
}