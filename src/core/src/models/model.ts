import { State } from './state';

export interface ModelItem<T> {
    item?: T;
    state: State;
}

export interface ModelItems<T> {
	items?: T[];
	state: State;
}
