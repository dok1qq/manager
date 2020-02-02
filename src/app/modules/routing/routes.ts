import { Routes } from '@angular/router';
import { WrapperComponent } from './pages/wrapper/wrapper.component';

export const routes: Routes = [
	{
		path: '',
		redirectTo: 'dashboard',
		pathMatch: 'full',
	},
	{
		path: '',
		component: WrapperComponent,
		children: [
			{
				path: 'dashboard',
				loadChildren: 'src/app/modules/routing/lazy/dashboard-lazy.module#DashboardLazyModule',
			},
			{
				path: 'create',
				loadChildren: 'src/app/modules/routing/lazy/editor-lazy.module#EditorLazyModule',
			},
			{
				path: 'edit/:id',
				loadChildren: 'src/app/modules/routing/lazy/editor-lazy.module#EditorLazyModule',
			},
		],
	},
	{
		path: '**',
		redirectTo: 'templates',
		pathMatch: 'full'
	},
];
