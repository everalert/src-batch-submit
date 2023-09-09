export type UIListItem = {
	value:	string;
	label?:	string;
	searchTerms?: string[];
	default?: boolean;
}

export type UIListItemGroup = {
	key: string;
	value: string;
	optional: boolean;
	items: UIListItem[];
}
