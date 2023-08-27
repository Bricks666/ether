import { CanActivate, SetMetadata, applyDecorators } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

const SET_ON_OF_KEY = 'set-one-of';

export interface Guard {
	new (...args: any[]): CanActivate;
}

export const SetOneOf = (...guards: Guard[]) => {
	return applyDecorators(SetMetadata(SET_ON_OF_KEY, guards));
};

export const getOneOf = (reflector: Reflector, handler: any): Guard[] => {
	return reflector.get(SET_ON_OF_KEY, handler) ?? [];
};
