import { MongoClient, ObjectId } from 'mongodb'
require('dotenv').config()


// const url = 'mongodb://db:27017'


async function main() {
  const url = 'mongodb://127.0.0.1:27017'
  // const url = 'mongodb://mongo'


  const client = new MongoClient(url)
  await client.connect()
  console.log('Connected successfully to mongodb')

  const db = client.db('test')

  await db.collection('admins').insertOne({ '_id': 'dbayadmin' } as any)
  console.log('Done setting admin')
  process.exit(0)
}

main()
