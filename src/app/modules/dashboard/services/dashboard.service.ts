import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Model } from '../models/model';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { State } from '../models/state';
import { JsonPlaceholderService } from './json-placeholder.service';
import { User } from '../models/user';

@Injectable()
export class DashboardService {

    refresh$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private jsonPlaceholderService: JsonPlaceholderService) {}

    refresh(): void {
        this.refresh$.next(true);
    }

    getModel(): Observable<Model> {
        return this.refresh$.pipe(
            switchMap(() => this.initModel())
        );
    }

    private initModel(): Observable<Model> {
        return this.jsonPlaceholderService.getUsers().pipe(
            map((items: User[]) => ({ state: State.READY, items })),
            catchError((err: any) => {
                console.error(err);
                return of({ state: State.ERROR });
            }),
            startWith({ state: State.PENDING }),
        );
    }
}
