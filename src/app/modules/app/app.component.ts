import { ChangeDetectionStrategy, Component } from '@angular/core';

// import {name} from '@manager/api/firebase';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

	constructor() {
		// console.log(name);
	}
}
