import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { routes } from './routes';
import { WrapperComponent } from './pages/wrapper/wrapper.component';
import { LoadingBarComponent } from './components/loading-bar/loading-bar.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forRoot(routes)
	],
	declarations: [
		// Components
		LoadingBarComponent,

		// Pages
		WrapperComponent,
		// Auth page,
		// Error 404 Page,
	],
	exports: [RouterModule],
})
export class RoutingModule {}
