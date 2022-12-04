import {MongoClient, ObjectId} from 'mongodb'
require('dotenv').config()


const url = 'mongodb://127.0.0.1:27017'
const client = new MongoClient(url)

async function main() {
  await client.connect()
  console.log('Connected successfully to mongodb')

  const db = client.db('test')

  await db.collection('admins').insertOne({'_id': process.env.ADMIN_USERNAME!} as any)
  console.log('Done setting admin')
  process.exit(0)
}

main()
