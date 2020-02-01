import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { FilterManager } from '../models/filter-manager';
import { FirebaseApiService, IGetItemsResponse } from '@manager/api/firebase';
import { DialogInfoRef, DialogInfoService } from '@manager/components/dialog-info';
import { Item, ModelItems, State } from '@manager/core';
import { DetailComponent } from '@manager/dashboard/detail';

export type Model = ModelItems<Item>;

@Injectable()
export class DashboardService {

    private readonly refresh$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	private readonly filter$: BehaviorSubject<FilterManager> = new BehaviorSubject(new FilterManager(''));


	constructor(
		private dialogService: DialogInfoService,
		private firebase: FirebaseApiService,
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
				panelClass: 'dialog-info',
				data: { id: item.getId() }
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
	        this.getItems(),
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

    private getItems(): Observable<Item[]> {
		return this.firebase.getItems().pipe(
			map((response: IGetItemsResponse) => {
				return Object
					.keys(response)
					.map((key: string) => new Item(key, response[key]));
			})
		);
    }
}
