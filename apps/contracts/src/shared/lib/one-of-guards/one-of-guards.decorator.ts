import { UseGuards, applyDecorators } from '@nestjs/common';
import { Guard, SetOneOf } from './set-one-of.decorator';
import { OneOfGuard } from './one-of.guard';

export const OneOfGuards = (...guards: Guard[]) => {
	return applyDecorators(SetOneOf(...guards), UseGuards(OneOfGuard));
};
