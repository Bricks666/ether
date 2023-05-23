import dotenv from 'dotenv';
import express, { json } from 'express';
import cors from 'cors';
import { createErrorHandler } from '@bricks-ether/server-utils';
import { contractsRouter } from './contracts';
import { web3Service } from './web3';
import { databaseService } from './database';

dotenv.config();

const app = express();

app.use(json(), cors());

app.use('/api', contractsRouter);

app.use(createErrorHandler());

const PORT = process.env.PORT || 5000

app.listen(PORT, async () => {
	web3Service.setProvider(process.env.NODE_HOST);
	databaseService.config.filename = process.env.DB_FILE;
	await databaseService.open();
});
