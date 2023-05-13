import dotenv from 'dotenv';
import express, { json } from 'express';
import cors from 'cors';
import { contractsRouter } from './contracts';
import { web3Service } from './web3';
import { databaseService } from './database';

dotenv.config();

const app = express();

app.use(json(), cors());

app.use('/api', contractsRouter);

app.listen(5000, async () => {
	web3Service.setProvider(process.env.NODE_HOST!);
	databaseService.config.filename = process.env.DB_FILE!;
	await databaseService.open();
});
