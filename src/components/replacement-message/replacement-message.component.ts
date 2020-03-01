import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type ReplacementMessageType = 'success' | 'info' | 'attention' | 'warning';

@Component({
	selector: 'replacement-message',
	templateUrl: 'replacement-message.component.html',
	styleUrls: ['replacement-message.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[class.-is-success]': 'type === "success"',
		'[class.-is-info]': 'type === "info"',
		'[class.-is-attention]': 'type === "attention"',
		'[class.-is-warning]': 'type === "warning"',
		'[class.-absolute]': '!!isAbsolute',
	},
})
export class ReplacementMessageComponent {

	@Input()
	type: ReplacementMessageType = 'success';

	@Input()
	isAbsolute: boolean = true;

}

