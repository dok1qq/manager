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
				loadChildren: () => import('./lazy/dashboard-lazy.module').then(m => m.DashboardLazyModule),
			},
			{
				path: 'create',
				loadChildren: () => import('./lazy/editor-lazy.module').then(m => m.EditorLazyModule),
			},
			{
				path: 'edit/:id',
				loadChildren: () => import('./lazy/editor-lazy.module').then(m => m.EditorLazyModule),
			},
		],
	},
	{
		path: '**',
		redirectTo: 'templates',
		pathMatch: 'full'
	},
];
