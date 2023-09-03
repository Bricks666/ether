import { Record, Static, String } from 'runtypes';

export const apiToken = Record({
	ownerId: String,
	token: String,
});

export interface ApiToken extends Static<typeof apiToken> {}
