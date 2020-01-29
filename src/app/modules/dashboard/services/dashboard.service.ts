import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { Model } from '../models/model';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { State } from '../models/state';
import { User } from '../models/user';
import { FilterManager } from '../models/filter-manager';
import { FirebaseService } from './firebase.service';

@Injectable()
export class DashboardService {

    private readonly refresh$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	private readonly filter$: BehaviorSubject<FilterManager> = new BehaviorSubject(new FilterManager(''));


	constructor(private firebaseService: FirebaseService) {}

    refresh(): void {
        this.refresh$.next(true);
    }

    filter(manager: FilterManager): void {
		this.filter$.next(manager);
    }

    getModel(): Observable<Model> {
        return this.refresh$.pipe(
            switchMap(() => this.initModel())
        );
    }

    private initModel(): Observable<Model> {
        return combineLatest([
        	this.filter$.asObservable(),
	        this.firebaseService.getUsers(),
        ]).pipe(
            map(([manager, items]: [FilterManager, User[]]) => manager.filter(items)),
	        map((items: User[]) => ({ state: State.READY, items })),
            catchError((err: any) => {
                console.error(err);
                return of({ state: State.ERROR });
            }),
            startWith({ state: State.PENDING }),
        );
    }
}
