import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { ListComponent } from './components/list/list.component';
import { ItemComponent } from './components/item/item.component';
import { FilterComponent } from './components/filter/filter.component';
import { ReplacementMessageModule } from '../replacement-message/replacement-message.module';

@NgModule({
    imports: [
        CommonModule,

	    ReplacementMessageModule,
    ],
    providers: [],
    declarations: [
        // Containers
        DashboardComponent,

        // Components
        ListComponent,
        ItemComponent,
	    FilterComponent,
    ],
    exports: [DashboardComponent],
})
export class DashboardModule {}
