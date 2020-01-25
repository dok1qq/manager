import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Model } from '../../models/model';
import { DashboardService } from '../../services/dashboard.service';
import { JsonPlaceholderService } from '../../services/json-placeholder.service';

@Component({
    selector: 'dashboard-component',
    providers: [DashboardService, JsonPlaceholderService],
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
}
