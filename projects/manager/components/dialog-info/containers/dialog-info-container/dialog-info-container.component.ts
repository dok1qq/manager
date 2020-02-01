import { BasePortalOutlet, CdkPortalOutlet, ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ComponentRef,
	EmbeddedViewRef,
	EventEmitter,
	OnInit,
	ViewChild,
} from '@angular/core';
import { slideModal } from '../../animations/slide-modal';
import { DialogInfoConfig } from '../../models/dialog-info-config';


@Component({
	animations: [slideModal],
	selector: 'kpi-dialog-info-container',
	templateUrl: './dialog-info-container.component.html',
	styleUrls: ['./dialog-info-container.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[@slideModal]': 'state',
		'(@slideModal.start)': 'animationStateChanged.emit($event)',
		'(@slideModal.done)': 'animationStateChanged.emit($event)',
	},
})
export class DialogInfoContainerComponent extends BasePortalOutlet implements OnInit {

	@ViewChild('infoOutlet', { read: CdkPortalOutlet, static: true })
	public infoOutlet: CdkPortalOutlet;

	@ViewChild('editorOutlet', { read: CdkPortalOutlet, static: true })
	public editorOutlet: CdkPortalOutlet;

	public config: DialogInfoConfig;
	public state: 'void' | 'enter' | 'exit' = 'enter';
	public animationStateChanged: EventEmitter<AnimationEvent> = new EventEmitter<AnimationEvent>();

	constructor(
		private changeDetectorRef: ChangeDetectorRef,
	) {
		super();
	}

	ngOnInit(): void {
	}

	attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
		if (this.infoOutlet && this.infoOutlet.hasAttached()) {
			throw new Error('Компонент уже прикреплен.');
		}
		return this.infoOutlet.attachComponentPortal(portal);
	}

	attachComponentEditorPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
		if (this.editorOutlet && this.editorOutlet.hasAttached()) {
			throw new Error('Компонент уже прикреплен.');
		}
		return this.editorOutlet.attachComponentPortal(portal);
	}

	attachTemplatePortal<T>(portal: TemplatePortal<T>): EmbeddedViewRef<T> {
		if (this.infoOutlet && this.infoOutlet.hasAttached()) {
			throw new Error('Темплейт уже прикреплен.');
		}
		return this.infoOutlet.attachTemplatePortal(portal);
	}

	startExitAnimation(): void {
		this.state = 'exit';
		this.changeDetectorRef.markForCheck();
	}

	isEditorAttached(): boolean {
		return this.editorOutlet && this.editorOutlet.hasAttached();
	}

	detachEditor(): void {
		this.editorOutlet.detach();
	}
}
