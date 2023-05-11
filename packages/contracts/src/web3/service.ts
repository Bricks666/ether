import Web3 from 'web3';

export class Web3Service extends Web3 {
	constructor() {
		super(process.env.NODE_HOST);
	}

	async getAccountByIndex(index: number): Promise<string> {
		const accounts = await this.eth.getAccounts();
		const account = accounts.at(index);

		if (!account) {
			throw new Error('Not found');
		}

		return account;
	}
}

export const web3Service = new Web3Service();
