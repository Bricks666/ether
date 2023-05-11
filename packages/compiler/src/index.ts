import dotenv from 'dotenv';
import express, { json } from 'express';
import cors from 'cors';
import { compilerRouter } from './router';

dotenv.config();

const app = express();

app.use(json(), cors());

app.use('/api', compilerRouter);

app.listen(process.env.PORT, () => {
	console.log(`compiler start on port: ${process.env.PORT}`);
});
