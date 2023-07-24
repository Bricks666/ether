import { Prisma } from '@prisma/client';
import { ConfigurableModuleBuilder } from '@nestjs/common';

export const {
	ConfigurableModuleClass,
	ASYNC_OPTIONS_TYPE,
	MODULE_OPTIONS_TOKEN,
	OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<Prisma.PrismaClientOptions>({
	moduleName: 'database',
})
	.setClassMethodName('forRoot')
	.setExtras<{ isGlobal?: boolean }>(
		{ isGlobal: true, },
		(definition, extra) => ({ ...definition, global: extra.isGlobal, })
	)
	.build();
