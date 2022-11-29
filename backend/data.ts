import { customers, items } from './server'

interface DbayUser {
  userName: string,
  name: string,
  email: string | undefined,
  phone: string | undefined,
  address: string | undefined
}

interface DbayItem {
  _id: string
  itemName: string,
  createdBy: string,
  imageLink: string[],
  price: number,
  description: string
}

export async function getUser(userName:string): Promise<undefined | DbayUser> {
  const customer = await customers.findOne({ _id: userName })
  if (customer == null) {return undefined}
  return {userName, name: customer.name, email: customer.email, phone: customer.phone, address: customer.address}
} 

export async function createItem(dbayItem: Omit<DbayItem, '_id' | 'imageLink'>) {
	const customer = await customers.findOne({ _id: dbayItem.createdBy })
	if (customer == null) {return "Dbay user does not exist"}
	const result = await items.insertOne(dbayItem)
	return result.insertedId.toString()
}