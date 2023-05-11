import dotenv from 'dotenv';
import express, { Router, json } from 'express';
import cors from 'cors';
import { contractsRouter } from './contracts';
import { web3Service } from './web3';
import { databaseService } from './database';

dotenv.config();

const app = express();

app.use(json(), cors());

const mainRouter = Router();

mainRouter.get('/ping', async (req, res) => {
	const accounts = await web3Service.eth.getAccounts();
	res.json(accounts);
});

mainRouter.use('/contracts', contractsRouter);

app.use('/api', mainRouter);

app.listen(process.env.PORT, async () => {
	web3Service.setProvider(process.env.NODE_HOST);
	databaseService.config.filename = process.env.DB_FILE;
	await databaseService.open();
});
