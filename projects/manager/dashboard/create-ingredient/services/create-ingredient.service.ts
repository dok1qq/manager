import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ModelItem, State } from '@manager/core';
import { catchError, delay, map, startWith, switchMap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

export type Model = ModelItem<any>;

@Injectable()
export class CreateIngredientService {

	refresh$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	constructor() {
	}

	refresh(): void {
		this.refresh$.next(true);
	}

	getModel(): Observable<Model> {
		return this.refresh$.pipe(
			switchMap(() => this.initModel())
		);
	}

	private initModel(): Observable<Model> {
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
