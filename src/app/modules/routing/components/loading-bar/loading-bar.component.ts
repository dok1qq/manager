import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'kpi-loading-bar',
	templateUrl: './loading-bar.component.html',
	preserveWhitespaces: false,
	styleUrls: ['./loading-bar.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[class.loading-bar-fixed]': 'fixed',
	}
})
export class LoadingBarComponent {
	@Input() public includeSpinner: boolean = false;
	@Input() public includeBar: boolean = true;
	@Input() public fixed: boolean = true;
	@Input() public color: string;
	@Input() public height: string;
	@Input() public diameter: string;
}
