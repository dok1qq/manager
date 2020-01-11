import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { Observable } from 'rxjs';
import { Model } from '../../models/model';
import { UsersService } from '../../services/users.service';

@Component({
    selector: 'dashboard-component',
    providers: [DashboardService, UsersService],
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {

    readonly model$: Observable<Model>;

    constructor(private service: DashboardService) {
        this.model$ = this.service.getModel();
    }

    refresh(): void {
        this.service.refresh();
    }
}
