interface DbayUser {
	userName: string,
  firstName: string,
  lastName: string,
	email: string,
	phone: string,
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