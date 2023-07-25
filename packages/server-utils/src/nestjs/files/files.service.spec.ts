/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable no-undef */
import { extname, join, resolve } from 'node:path';
import { unlink, writeFile } from 'node:fs/promises';
import { v4 } from 'uuid';
import { InternalServerErrorException } from '@nestjs/common';
import { FilesService } from './files.service';

jest.mock('uuid', () => {
	return {
		v4: jest.fn(),
	};
});

jest.mock('node:path', () => {
	return {
		extname: jest.fn(),
		join: jest.fn(),
		resolve: jest.fn(),
	};
});

jest.mock('node:fs/promises', () => {
	return {
		writeFile: jest.fn(),
		unlink: jest.fn(),
	};
});

const mockDir = '/some/dir';
const mockClientPath = 'http://example.com';
const mockUuid = 'uuid';
const mockExtname = '.txt';
const mockJoinResult = '/some/joined/path';
const mockResoledPath = '/some/resolved/path';
const replacedPath = '/replaced/path';
const mockFileSystemPath = '/some/file/system/path';
const mockServerPath = 'http://example.com/static';

const mockFileName = mockUuid + mockExtname;

const error = new Error('Mock');

const mockFile = {
	originalName: 'original name',
	buffer: Buffer.alloc(0),
} as unknown as Express.Multer.File;

(v4 as jest.Mock).mockReturnValue(mockUuid);
(extname as jest.Mock).mockReturnValue(mockExtname);
(join as jest.Mock).mockReturnValue(mockJoinResult);
(resolve as jest.Mock).mockReturnValue(mockResoledPath);

describe('FilesService', () => {
	let filesService: FilesService;

	beforeAll(() => {
		filesService = new FilesService({
			dir: mockDir,
			clientPath: mockClientPath,
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		jest.restoreAllMocks();
	});

	describe('writeFile', () => {
		let mockGetFileSystemPath: jest.MockInstance<any, any>;
		let mockGetServePath: jest.MockInstance<any, any>;

		beforeAll(() => {
			mockGetFileSystemPath = jest
				.spyOn(filesService, 'getFileSystemPath')
				.mockReturnValue(mockFileSystemPath);
			mockGetServePath = jest
				.spyOn(filesService, 'getServePath')
				.mockReturnValue(mockServerPath);
		});

		afterAll(() => {
			mockGetFileSystemPath.mockRestore();
			mockGetServePath.mockRestore();
		});

		test('should generate filename from uuid and extension', async () => {
			await filesService.writeFile(mockFile);

			expect(v4).toHaveBeenCalledTimes(1);
			expect(v4).toHaveBeenCalledWith();
			expect(extname).toHaveBeenCalledTimes(1);
			expect(extname).toHaveBeenCalledWith(mockFile.originalname);
		});

		test('should generate filesystem and serve path by name', async () => {
			await filesService.writeFile(mockFile);

			expect(mockGetFileSystemPath).toHaveBeenCalledTimes(1);
			expect(mockGetFileSystemPath).toHaveBeenCalledWith(mockFileName);
			expect(mockGetServePath).toHaveBeenCalledTimes(1);
			expect(mockGetServePath).toHaveBeenCalledWith(mockFileName);
		});

		test('should write file with filesystem path', async () => {
			await filesService.writeFile(mockFile);

			expect(writeFile).toHaveBeenCalledTimes(1);
			expect(writeFile).toHaveBeenCalledWith(
				mockFileSystemPath,
				mockFile.buffer
			);
		});

		test('should return servePath', async () => {
			const result = await filesService.writeFile(mockFile);

			expect(result).toBe(mockServerPath);
		});

		test('should throw wrapped error if it thrown', async () => {
			mockGetFileSystemPath.mockImplementationOnce(() => {
				throw error;
			});
			expect(() => filesService.writeFile(mockFile)).rejects.toThrowError(
				new InternalServerErrorException('Write file error', { cause: error, })
			);
		});
	});

	describe('removeFile', () => {
		test('should unlink file with passed path', async () => {
			await filesService.removeFile(mockFileSystemPath);

			expect(unlink).toHaveBeenCalledTimes(1);
			expect(unlink).toHaveBeenCalledWith(mockFileSystemPath);
		});

		test('should throw wrapped error if it thrown', async () => {
			(unlink as jest.Mock).mockImplementationOnce(() => {
				throw error;
			});
			expect(() =>
				filesService.removeFile(mockFileSystemPath)
			).rejects.toThrowError(
				new InternalServerErrorException('Remove file error', { cause: error, })
			);
		});
	});

	describe('getFileSystemPath', () => {
		test('should call resolve with configure dir', () => {
			filesService.getFileSystemPath(mockFileName);

			expect(resolve).toHaveBeenCalledTimes(1);
			expect(resolve).toHaveBeenCalledWith(mockDir, mockFileName);
		});

		test('should return resolved path', () => {
			const result = filesService.getFileSystemPath(mockFileName);

			expect(result).toBe(mockResoledPath);
		});

		test('should throw error if it thrown', async () => {
			(resolve as jest.Mock).mockImplementationOnce(() => {
				throw error;
			});
			expect(() => filesService.getFileSystemPath(mockFileName)).toThrowError(
				error
			);
		});
	});

	describe('getServePath', () => {
		test('should call resolve with configure client path', () => {
			filesService.getServePath(mockFileName);

			expect(resolve).toHaveBeenCalledTimes(1);
			expect(resolve).toHaveBeenCalledWith(mockClientPath, mockFileName);
		});

		test('should call return resolved path', () => {
			const result = filesService.getServePath(mockFileName);

			expect(result).toBe(mockResoledPath);
		});

		test('should throw error if it thrown', async () => {
			(resolve as jest.Mock).mockImplementationOnce(() => {
				throw error;
			});
			expect(() => filesService.getServePath(mockFileName)).toThrowError(error);
		});
	});

	describe('toFileSystemPath', () => {
		let replaceSpy: jest.MockInstance<any, any>;

		beforeAll(() => {
			replaceSpy = jest
				.spyOn(String.prototype, 'replace')
				.mockReturnValue(replacedPath);
		});

		afterAll(() => {
			replaceSpy.mockRestore();
		});

		test('should call replace with configure client path', () => {
			filesService.toFileSystemPath(mockFileSystemPath);

			expect(mockFileSystemPath.replace).toHaveBeenCalledTimes(1);
			expect(mockFileSystemPath.replace).toHaveBeenCalledWith(
				mockClientPath,
				''
			);
		});

		test('should call join with configure dir and replaced paths', () => {
			filesService.toFileSystemPath(mockFileName);

			expect(join).toHaveBeenCalledTimes(1);
			expect(join).toHaveBeenCalledWith(mockDir, replacedPath);
		});

		test('should return joined path', () => {
			const result = filesService.toFileSystemPath(mockFileName);

			expect(result).toBe(mockJoinResult);
		});

		test('should throw error if it thrown', async () => {
			(join as jest.Mock).mockImplementationOnce(() => {
				throw error;
			});
			expect(() => filesService.toFileSystemPath(mockFileName)).toThrowError(
				error
			);
		});
	});

	describe('toServePath', () => {
		let replaceSpy: jest.MockInstance<any, any>;

		beforeAll(() => {
			replaceSpy = jest
				.spyOn(String.prototype, 'replace')
				.mockReturnValue(replacedPath);
		});

		afterAll(() => {
			replaceSpy.mockRestore();
		});

		test('should call replace with configure dir path', () => {
			filesService.toServePath(mockServerPath);

			expect(mockServerPath.replace).toHaveBeenCalledTimes(1);
			expect(mockServerPath.replace).toHaveBeenCalledWith(mockDir, '');
		});

		test('should call join with configure client path and replaced paths', () => {
			filesService.toServePath(mockFileName);

			expect(join).toHaveBeenCalledTimes(1);
			expect(join).toHaveBeenCalledWith(mockClientPath, replacedPath);
		});

		test('should return joined path', () => {
			const result = filesService.toServePath(mockFileName);

			expect(result).toBe(mockJoinResult);
		});

		test('should throw error if it thrown', async () => {
			(join as jest.Mock).mockImplementationOnce(() => {
				throw error;
			});
			expect(() => filesService.toServePath(mockFileName)).toThrowError(error);
		});
	});
});
