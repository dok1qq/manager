import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { ListComponent } from './components/list/list.component';
import { ItemComponent } from './components/item/item.component';
import { FilterComponent } from './components/filter/filter.component';
import { ReplacementMessageModule } from '../replacement-message/replacement-message.module';
import { PreloaderModule } from '../preloader/preloader.module';

@NgModule({
    imports: [
        CommonModule,

	    // Component Modules
	    PreloaderModule,
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
