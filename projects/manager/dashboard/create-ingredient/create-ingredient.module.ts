import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateIngredientComponent } from './containers/create-ingredient/create-ingredient.component';
import { PreloaderModule } from '@manager/components/preloader';
import { ReplacementMessageModule } from '@manager/components/replacement-message';

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,

		// Components
		PreloaderModule,
		ReplacementMessageModule,
	],
	exports: [CreateIngredientComponent],
	declarations: [CreateIngredientComponent],
	entryComponents: [CreateIngredientComponent],
})
export class CreateIngredientModule {
}
