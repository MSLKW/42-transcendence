import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app.get('/', (req: Request, res: Response) => {
	// express.static('dist');
// });

app.use(express.static('dist'));

app.listen(port, () => {
	console.log(`Server is running on ${port}`);
})
