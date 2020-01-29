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
			/*{
				path: 'detail/:id',
				loadChildren
			},*/
			/*{
				path: 'create',
				loadChildren: '',
			},
			{
				path: 'edit/:id',
				loadChildren: '',
			}*/
		],
	},
	{
		path: '**',
		redirectTo: 'templates',
		pathMatch: 'full'
	},
];
