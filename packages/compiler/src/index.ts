import { createErrorHandler } from '@bricks-ether/server-utils';
import dotenv from 'dotenv';
import express, { json } from 'express';
import cors from 'cors';
import { compilerRouter } from './router';
import { initStaticDirs } from './lib';

dotenv.config();

const app = express();

app.use(json(), cors());

app.get('/ping', async (_, res) => {
	res.json('pong');
});

app.use('/api', compilerRouter);

app.use(createErrorHandler());

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
	await initStaticDirs();
	console.log(`compiler starts on port: ${PORT}`);
});
