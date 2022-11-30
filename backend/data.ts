import { ObjectId } from 'mongodb'
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
  description: string,
  createTime: Date
}

export async function getUser(userName:string): Promise<undefined | DbayUser> {
  const customer = await customers.findOne({ _id: userName })
  if (customer == null) {return undefined}
  return {userName, name: customer.name, email: customer.email, phone: customer.phone, address: customer.address}
} 

export async function createItem(dbayItem: Omit<DbayItem, '_id' | 'imageLink'>) {
	const customer = await customers.findOne({ _id: dbayItem.createdBy })
	if (customer == null) {return "Dbay user does not exist"}
	const result = await items.insertOne({...dbayItem, imageLink: []})
	return result.insertedId.toString()
}

export async function getItem(itemId: string): Promise<undefined | DbayItem> {
  const item = await items.findOne({ _id: new ObjectId(itemId) })
  if (item == null) {return undefined}
  return { _id: item._id.toString(), itemName: item.itemName, createdBy: item.createdBy, imageLink: item.imageLink, price: item.price, description: item.description,
  createTime: item.createTime }
}

export async function deleteItem(itemId: string, userName: string) {
  const result = await items.deleteOne( { _id: new ObjectId(itemId), createdBy: userName } )
  return result.deletedCount
}

export async function updateItem(dbayItem: Omit<DbayItem, 'imageLink' | "createTime">) {
  const result = await items.updateOne(
    {
      _id: new ObjectId(dbayItem._id),
      createdBy: dbayItem.createdBy
    },
    {
      $set: {
        itemName: dbayItem.itemName,
        price: dbayItem.price,
        description: dbayItem.description
      }
    }
  )
  return result.matchedCount
}

export async function addImageLink(itemId: string, filename: string) {
  const result = await items.updateOne(
    {
      _id: new ObjectId(itemId)
    },
    {
      $push: {
        imageLink: "api/image/" + filename
      }
    }
  )
  return result.matchedCount
}