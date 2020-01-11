import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Model } from '../models/model';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { State } from '../models/state';
import { UsersService } from './users.service';

@Injectable()
export class DashboardService {

    refresh$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private users: UsersService) {}

    refresh(): void {
        this.refresh$.next(true);
    }

    getModel(): Observable<Model> {
        return this.refresh$.pipe(
            switchMap(() => this.initModel())
        );
    }

    private initModel(): Observable<Model> {
        return this.users.getJsonPlaceholderUsers().pipe(
            map((items: any[]) => ({ state: State.READY, items })),
            catchError((err: any) => {
                console.error(err);
                return of({ state: State.ERROR });
            }),
            startWith({ state: State.PENDING }),
        );
    }
}
