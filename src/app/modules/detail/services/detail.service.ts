import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Model } from '../models/model';
import { FirebaseService } from './firebase.service';
import { Item } from '../models/item';
import { State } from '../models/state';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class DetailService {

	refresh$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	constructor(private firebase: FirebaseService) {}

	getLoading(): Observable<boolean> {
		return this.loading$.asObservable();
	}

	refresh(): void {
		this.refresh$.next(true);
	}

	getModel(id: string): Observable<Model> {
		return this.refresh$.pipe(
			switchMap(() => this.initModel(id))
		);
	}

	private initModel(id: string): Observable<Model> {
		return this.firebase.getItem(id).pipe(
			map((item: Item) => ({ item, state: State.READY })),
			catchError((err: HttpErrorResponse) => {
				console.error(err);
				return of({ state: State.ERROR });
			}),
			startWith({ state: State.PENDING }),
		);
	}
}
