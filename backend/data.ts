import { ObjectId } from 'mongodb'
import { customers, items } from './server'

export interface DbayUser {
  userName: string,
  firstName: string,
  lastName: string,
  email: string | undefined,
  phone: string | undefined,
  address: string | undefined
}

export interface DbayItem {
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
  return {userName, firstName: customer.firstName, lastName: customer.lastName, email: customer.email, phone: customer.phone, address: customer.address}
} 

export async function createItem(dbayItem: Omit<DbayItem, '_id' | 'imageLink'>) {
	const customer = await customers.findOne({ _id: dbayItem.createdBy })
	if (customer == null) {return "Dbay user does not exist"}
	const result = await items.insertOne({...dbayItem, imageLink: []})
	return result.insertedId.toString()
}

export async function getItem(itemId: string): Promise<DbayItem> {
  try {
    const id = new ObjectId(itemId)
  }
  catch {
    return undefined
  }
  const item = await items.findOne({ _id: new ObjectId(itemId) })
  if (item == null) {return undefined}
  return { _id: item._id.toString(), itemName: item.itemName, createdBy: item.createdBy, imageLink: item.imageLink, price: item.price, description: item.description,
  createTime: item.createTime }
}

export async function deleteItem(itemId: string, userName: string) {
  try {
    const id = new ObjectId(itemId)
  }
  catch {
    return 0
  }
  const result = await items.deleteOne( { _id: new ObjectId(itemId), createdBy: userName } )
  return result.deletedCount
}

export async function updateUser(dbayUser: Omit<DbayUser, 'email' | 'userName'>, userName: string) {
  const result = await customers.updateOne(
    {
      _id: userName
    },
    {
      $set: {
        firstName: dbayUser.firstName,
        lastName: dbayUser.lastName,
        phone: dbayUser.phone,
        address: dbayUser.address
      }
    }
  )
  return result.matchedCount
}

export async function updateItem(dbayItem: Omit<DbayItem, 'imageLink' | "createTime">) {
  try {
    const id = new ObjectId(dbayItem._id)
  }
  catch {
    return 0
  }
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
        imageLink: "api/images/" + filename
      }
    }
  )
  return result.matchedCount
}

export async function searchItem(searchType: "itemName" | "username", keyword: string, sortBy: 'createTime' | 'priceHighToLow' | 'priceLowToHigh') {
  let orderKey = {}
  switch (sortBy) {
    case "createTime": {
      orderKey = { createTime: -1 }
      break
    }
    case "priceHighToLow": {
      orderKey = { price: -1 }
      break
    }
    case "priceLowToHigh": {
      orderKey = { price: 1 }
      break
    }
  }
  let searchKey = {}
  if (searchType == "itemName") {
    searchKey = { itemName: { $regex: keyword } }
  }
  else {
    searchKey = { createdBy: { $regex: keyword } }
  }
  const cursor = await items.find(searchKey).sort(orderKey)
  const searchResult = (await cursor.toArray()).map(document => {
    return {...document, _id: document._id.toString()}
  })
  return searchResult
}

export async function deleteImageLink(itemid: string, link: string) {
  try {
    const id = new ObjectId(itemid)
  }
  catch {
    return 0
  }
  const result = await items.updateOne(
    {
      _id: new ObjectId(itemid)
    },
    {
      $pull: { imageLink: link }
    }
  )
  return result.modifiedCount
}
