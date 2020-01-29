import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Model } from '../../models/model';
import { DashboardService } from '../../services/dashboard.service';
import { FilterManager } from '../../models/filter-manager';
import { FirebaseService } from '../../services/firebase.service';
import { Item } from '../../models/item';

@Component({
    selector: 'dashboard-component',
    providers: [DashboardService, FirebaseService],
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {

    readonly model$: Observable<Model>;

    constructor(private service: DashboardService) {
        this.model$ = this.service.getModel();
    }

	cd(model: Model): boolean {
    	console.log('change detection: ', model);
    	return false;
	}

    refresh(): void {
        this.service.refresh();
    }

	filterChange(value: FilterManager): void {
    	this.service.filter(value);
	}

	detail(item: Item): void {
    	this.service.detail(item);
	}
}
