interface DbayUser {
	userName: string,
  name: string,
	email: string | undefined,
	phone: string | undefined,
	address: string
}

interface DbayItem {
	_id: string
	itemName: string,
	createdBy: string,
	imageLink: string[],
	price: number,
	description: string
}