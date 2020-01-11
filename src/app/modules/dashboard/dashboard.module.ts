import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { ListComponent } from './components/list/list.component';
import { ItemComponent } from './components/item/item.component';

@NgModule({
    imports: [
        CommonModule,
    ],
    providers: [],
    declarations: [
        // Containers
        DashboardComponent,

        // Components
        ListComponent,
        ItemComponent,
    ],
    exports: [DashboardComponent],
})
export class DashboardModule {}
