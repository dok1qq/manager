import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { Model } from '../models/model';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { State } from '../models/state';
import { FilterManager } from '../models/filter-manager';
import { FirebaseService } from './firebase.service';
import { Item } from '../models/item';
import { DialogInfoRef } from '../../dialog-info/models/dialog-info-ref';
import { DetailComponent } from '../../detail/containers/detail/detail.component';
import { DialogInfoService } from '../../dialog-info/dialog-info.service';

@Injectable()
export class DashboardService {

    private readonly refresh$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	private readonly filter$: BehaviorSubject<FilterManager> = new BehaviorSubject(new FilterManager(''));


	constructor(
		private dialogService: DialogInfoService,
		private firebaseService: FirebaseService,
	) {}

    refresh(): void {
        this.refresh$.next(true);
    }

    filter(manager: FilterManager): void {
		this.filter$.next(manager);
    }

    detail(item: Item): void {
		const ref: DialogInfoRef<DetailComponent, boolean> = this.dialogService
			.openInfo(DetailComponent, {
				data: { id: item.id }
			});
		ref.afterClosed().subscribe((result: boolean) => {
			if (result) {
				this.refresh();
			}
		})
    }

    getModel(): Observable<Model> {
        return this.refresh$.pipe(
            switchMap(() => this.initModel())
        );
    }

    private initModel(): Observable<Model> {
        return combineLatest([
        	this.filter$.asObservable(),
	        this.firebaseService.getItems(),
        ]).pipe(
            map(([manager, items]: [FilterManager, Item[]]) => manager.filter(items)),
	        map((items: Item[]) => ({ state: State.READY, items })),
            catchError((err: any) => {
                console.error(err);
                return of({ state: State.ERROR });
            }),
            startWith({ state: State.PENDING }),
        );
    }
}
