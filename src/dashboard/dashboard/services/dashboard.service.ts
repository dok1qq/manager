import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { FilterManager } from '../models/filter-manager';
import { FirebaseApiService, IItemBase, Response } from '@manager/api/firebase';
import { DialogInfoRef, DialogInfoService } from '@manager/components/dialog-info';
import { AbstractModel, ItemShort, ModelItems, State } from '@manager/core';
import { DetailComponent } from '@manager/dashboard/detail';
import { Router } from '@angular/router';

export type Model = ModelItems<ItemShort>;

@Injectable()
export class DashboardService extends AbstractModel<void, Model> {

	private readonly filter$: BehaviorSubject<FilterManager> = new BehaviorSubject(new FilterManager(''));

	constructor(
		private dialogService: DialogInfoService,
		private firebase: FirebaseApiService,
		private router: Router,
	) {
		super();
	}

    filter(manager: FilterManager): void {
		this.filter$.next(manager);
    }

    detail(item: ItemShort): void {
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

	createItem(): void {
		this.router.navigate(['/create']);
	}

    protected initModel(): Observable<Model> {
        return combineLatest([
        	this.filter$.asObservable(),
	        this.getItems(),
        ]).pipe(
            map(([manager, items]: [FilterManager, ItemShort[]]) => manager.filter(items)),
	        map((items: ItemShort[]) => ({ state: State.READY, items })),
            catchError((err: any) => {
                console.error(err);
                return of({ state: State.ERROR });
            }),
            startWith({ state: State.PENDING }),
        );
    }

    private getItems(): Observable<ItemShort[]> {
		return this.firebase.getBaseItems().pipe(
			map((response: Response<IItemBase>) => {
				return Object
					.keys(response)
					.map((key: string) => new ItemShort(key, response[key]));
			})
		);
    }
}
