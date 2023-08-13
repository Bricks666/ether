import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import {
	Observable,
	catchError,
	from,
	last,
	map,
	mergeMap,
	of,
	takeWhile
} from 'rxjs';
import { getOneOf } from './set-one-of.decorator';

type CanActivateResult = ReturnType<CanActivate['canActivate']>;

@Injectable()
export class OneOfGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly moduleRef: ModuleRef
	) {}

	canActivate(context: ExecutionContext): CanActivateResult {
		return from(getOneOf(this.reflector, context.getHandler())).pipe(
			map((guardType) => this.moduleRef.create(guardType)),
			map((guard) => from(guard)),
			mergeMap((guard) =>
				guard.pipe(
					map((guard) =>
						this.normalizeCanActivateResult(guard.canActivate(context)).pipe(
							catchError((error) => {
								console.log(error);
								return of(false);
							})
						)
					)
				)
			),
			mergeMap((value) => value.pipe(map((value) => value))),
			takeWhile((value) => value === false, true),
			last()
		);
	}

	private normalizeCanActivateResult(
		result: CanActivateResult
	): Observable<boolean> {
		if (this.isObservable(result)) {
			return result;
		}

		if (this.isPromise(result)) {
			return from(result);
		}

		return of(result);
	}

	private isPromise(guard: CanActivateResult): guard is Promise<boolean> {
		return !!(guard as Promise<boolean>).then;
	}

	private isObservable(guard: CanActivateResult): guard is Observable<boolean> {
		return !!(guard as Observable<boolean>).pipe;
	}
}
