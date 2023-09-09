export type User = {
	id: string;	
	name: string;
	url?: string;
	originaldata: Object;
}

export function ParseProfileAPI(apidata: Object): User {
	const data = apidata.data
	return {
		id:		data.id,
		name:	data.names.international,
		url:	data.weblink,
		originaldata: data,
	}
}
