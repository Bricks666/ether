import dotenv from 'dotenv';
import express, { json } from 'express';
import cors from 'cors';
import Web3 from 'web3';
import { HttpProvider } from 'web3-core';

dotenv.config();

const app = express();

const web3 = new Web3(process.env.NODE_HOST);

app.use(json(), cors());

app.get('/ping', async (req, res) => {
	const accounts = await web3.eth.getAccounts();
	res.json(accounts);
});

app.listen(process.env.PORT, () => {
	const provider = web3.currentProvider as HttpProvider;

	console.log(provider.connected);
	setTimeout(() => console.log(provider.connected), 1500);
	console.log('hello world');
});
