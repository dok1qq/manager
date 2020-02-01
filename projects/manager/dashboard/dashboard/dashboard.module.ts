import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { ListComponent } from './components/list/list.component';
import { ItemComponent } from './components/item/item.component';
import { FilterComponent } from './components/filter/filter.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DialogInfoModule } from '@manager/components/dialog-info';
import { PreloaderModule } from '@manager/components/preloader';
import { ReplacementMessageModule } from '@manager/components/replacement-message';
import { DetailModule } from '@manager/dashboard/detail';

const routes: Routes = [{
	path: '',
	component: DashboardComponent,
}];

@NgModule({
    imports: [
        CommonModule,
	    ReactiveFormsModule,
	    RouterModule.forChild(routes),

	    // Component Modules
	    PreloaderModule,
	    ReplacementMessageModule,

	    // Modal
	    DialogInfoModule,
	    DetailModule,
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
