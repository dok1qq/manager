import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { FilterManager } from '../models/filter-manager';
import { FirebaseApiService, IItemBase } from '@manager/api/firebase';
import { DialogInfoRef, DialogInfoService } from '@manager/components/dialog-info';
import { AbstractModel, ModelItems, State } from '@manager/core';
import { DetailComponent } from '@manager/dashboard/detail';
import { Router } from '@angular/router';

export type Model = ModelItems<IItemBase>;

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

    detail(item: IItemBase): void {
		const ref: DialogInfoRef<DetailComponent, boolean> = this.dialogService
			.openInfo(DetailComponent, {
				panelClass: 'dialog-info',
				data: { id: item.id }
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
            map(([manager, items]: [FilterManager, IItemBase[]]) => manager.filter(items)),
	        map((items: IItemBase[]) => ({ state: State.READY, items })),
            catchError((err: any) => {
                console.error(err);
                return of({ state: State.ERROR });
            }),
            startWith({ state: State.PENDING }),
        );
    }

    private getItems(): Observable<IItemBase[]> {
		return this.firebase.getBaseItems();
    }
}
