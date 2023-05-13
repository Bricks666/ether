import { mkdir } from 'node:fs/promises';
import dotenv from 'dotenv';
import express, { json } from 'express';
import cors from 'cors';
import { compilerRouter } from './router';
import { STATIC_DIR } from './config';

dotenv.config();

const app = express();

app.use(json(), cors());

app.use('/api', compilerRouter);

app.listen(process.env.PORT, async () => {
	await mkdir(STATIC_DIR, { recursive: true, });
	console.log(`compiler start on port: ${process.env.PORT}`);
});
