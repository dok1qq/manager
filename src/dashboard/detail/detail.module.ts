import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailComponent } from './containers/detail/detail.component';
import { ContentComponent } from './components/content/content.component';
import { PreloaderModule } from '@manager/components/preloader';
import { ReplacementMessageModule } from '@manager/components/replacement-message';
import { CreateIngredientModule } from '@manager/dashboard/create-ingredient';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
	imports: [
		CommonModule,

		// Components
		PreloaderModule,
		ReplacementMessageModule,
		MatButtonModule,

		// Editors
		CreateIngredientModule,
	],
	declarations: [
		// Containers
		DetailComponent,

		// Components
		ContentComponent,
	],
	exports: [DetailComponent],
})
export class DetailModule {
}
