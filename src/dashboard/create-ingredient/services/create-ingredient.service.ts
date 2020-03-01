import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AbstractModel, ModelItem, State } from '@manager/core';
import { catchError, delay, map, startWith } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

export type Model = ModelItem<any>;

@Injectable()
export class CreateIngredientService extends AbstractModel<void, Model> {

	constructor() {
		super();
	}

	protected initModel(): Observable<Model> {
		return of(true).pipe(
			delay(1000),
			map(() => ({ state: State.READY })),
			catchError((err: HttpErrorResponse) => {
				console.error(err);
				return of({ state: State.ERROR });
			}),
			startWith({ state: State.PENDING }),
		);
	}
}
