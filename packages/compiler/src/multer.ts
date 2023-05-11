import createMulter, { memoryStorage } from 'multer';

export const multer = createMulter({
	storage: memoryStorage(),
});
