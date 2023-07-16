import { join } from 'node:path';
import dotenv from 'dotenv';
import express, { json } from 'express';
import cors from 'cors';
import { createErrorHandler } from '@bricks-ether/server-utils';
import { contractsRouter } from './contracts';
import { web3Service } from './web3';
import { databaseService } from './database';

dotenv.config();

const app = express();

app.use(
	json(),
	cors({
		credentials: true,
		origin(requestOrigin, callback) {
			callback(null, true);
		},
	})
);

app.use('/api', contractsRouter);

app.use(createErrorHandler());

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
	web3Service.setProvider(process.env.NODE_HOST);
	databaseService.config.filename = join('database', process.env.DB_FILE);
	await databaseService.open();
	console.log(`contracts service starts on port: ${PORT}`);
});
