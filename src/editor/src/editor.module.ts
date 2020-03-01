import { NgModule } from '@angular/core';
import { EditorComponent } from './containers/editor/editor.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PreloaderModule } from '@manager/components/preloader';
import { ReplacementMessageModule } from '@manager/components/replacement-message';
import { RouterModule, Routes } from '@angular/router';
import { ItemFormComponent } from './components/form/form.component';
import { MatFormFieldModule, MatInputModule } from '@angular/material';

const routes: Routes = [{
	path: '',
	component: EditorComponent,
}];

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		RouterModule.forChild(routes),

		// Components
		PreloaderModule,
		ReplacementMessageModule,

		// Material
		MatInputModule,
		MatFormFieldModule,
	],
	providers: [],
	declarations: [
		EditorComponent,
		ItemFormComponent,
	],
	exports: [EditorComponent],
})
export class EditorModule {}
