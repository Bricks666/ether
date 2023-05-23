import { createErrorHandler } from '@bricks-ether/server-utils';
import dotenv from 'dotenv';
import express, { json } from 'express';
import cors from 'cors';
import { schedule } from 'node-cron';
import { compilerRouter } from './router';
import { initStaticDirs } from './lib';
import { compilerVersionService } from './versions';

dotenv.config();

const app = express();

app.use(json(), cors());

app.get('/ping', async (_, res) => {
	res.json('pong');
});

app.use('/api', compilerRouter);

app.use(createErrorHandler());

const PORT = process.env.PORT || 5000;

const updateVersionTask = schedule(
	'* * * 1,4,7,10 *',
	() => {
		compilerVersionService.loadSolidityVersion();
	},
	{
		runOnInit: true,
	}
);

app.listen(PORT, async () => {
	await initStaticDirs();
	updateVersionTask.start();
	console.log(`compiler starts on port: ${PORT}`);
});
