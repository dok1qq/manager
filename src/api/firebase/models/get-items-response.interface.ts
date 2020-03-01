import { IItemBase } from './item-base';

export interface IGetItemsResponse  {
	[id: string]: IItemBase;
}
