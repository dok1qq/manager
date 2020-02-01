import { IItem } from './item';

export interface IGetItemsResponse  {
	[id: string]: IItem;
}
