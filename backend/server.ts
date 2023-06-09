import express, { NextFunction, Request, Response } from 'express'
import bodyParser from 'body-parser'
import pino from 'pino'
import expressPinoLogger from 'express-pino-logger'
import { Collection, Db, MongoClient, ObjectId } from 'mongodb'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import { Issuer, Strategy } from 'openid-client'
import passport from 'passport'
import { keycloak } from "./secrets"
import { getUser, createItem, deleteItem, updateItem, getItem, addImage, updateUser, searchItem, deleteImage } from "./data"
import fs from "fs"
import { v4 as uuidv4 } from 'uuid'

require('dotenv').config()

if (process.env.PROXY_KEYCLOAK_TO_LOCALHOST) {
  // NOTE: this is a hack to allow Keycloak to run from the 
  // same development machine as the rest of the app. We have exposed
  // Keycloak to run off port 8081 of localhost, where localhost is the
  // localhost of the underlying laptop, but localhost inside of the
  // server's Docker container is just the container, not the laptop.
  // The following line creates a reverse proxy to the Keycloak Docker
  // container so that localhost:8081 can also be used to access Keycloak.
  require("http-proxy").createProxyServer({ target: "http://keycloak:8080" }).listen(8081)
}

const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017'
const client = new MongoClient(mongoUrl)
let db: Db
export let customers: Collection
export let items: Collection
let admins: Collection
export let images: Collection

const multer  = require('multer')
const upload = multer({ dest: 'images/' })

const app = express()
const port = parseInt(process.env.PORT) || 8095
app.use(bodyParser.json({limit: '10mb'}))
app.use(bodyParser.urlencoded({ extended: true }))

const logger = pino({
  transport: {
    target: 'pino-pretty'
  }
})
app.use(expressPinoLogger({ logger }))

app.use(session({
  // secret: process.env.SESSION_SECRET,
  secret: 'cs590+Dbay',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },

  // comment out the following to default to a memory-based store, which,
  // of course, will not persist across load balanced servers
  // or survive a restart of the server
  store: MongoStore.create({
    mongoUrl,
    ttl: 14 * 24 * 60 * 60 // 14 days
  })
}))

app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser((user: any, done: any) => {
  logger.info("serializeUser " + JSON.stringify(user))
  done(null, user)
})
passport.deserializeUser((user: any, done: any) => {
  logger.info("deserializeUser " + JSON.stringify(user))
  done(null, user)
})

function checkAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    res.sendStatus(401)
    return
  }

  next()
}

app.get("/api/users/is-admin", (req, res) => {
  res.status(200).json({ isAdmin: req.user != undefined && (req.user as any).roles == "Admin" })
})

app.get("/api/user", (req, res) => {
  res.json(req.user || {})
})

app.get("/api/users/:username/profile", checkAuthenticated, async (req, res) => {
  const customer = await getUser(req.params.username)
  let status = 200
  if (customer === undefined) {
    status = 400
  }
  res.status(status).json({ dbayUser: customer })
})

app.get("/api/items/:itemid/details", async (req, res) => {
  const item = await getItem(req.params.itemid)
  let status = 200
  if (item === undefined) {
    status = 400
  }
  res.status(status).json({ result: item })
})

app.post("/api/items/create-item", checkAuthenticated, async (req, res) => {
  console.log(req.body.dbayItem)
  //Check payload content
  if (typeof req.body.dbayItem.itemName === "string" &&
      typeof req.body.dbayItem.createdBy === "string" &&
      typeof req.body.dbayItem.price === "number" &&
      typeof req.body.dbayItem.description === "string") {
    
    //User cannot create other user's item
    if (req.body.dbayItem.createdBy != (req.user as any).preferred_username) {
      res.status(400).json({ status: "User name does not match" })
      return
    }

    //Check price
    if (req.body.dbayItem.price <= 0) {
      res.status(400).json({ status: "Item price must be positive" })
      return
    }

    //Add item to mongo
    let result = await createItem(
      {
        itemName: req.body.dbayItem.itemName,
        createdBy: req.body.dbayItem.createdBy,
        price: req.body.dbayItem.price,
        description: req.body.dbayItem.description,
        createTime: new Date()
      }
    )

    if (result == "Dbay user does not exist") {
      res.status(400).json({ status: "Dbay user does not exist" })
      return
    } 
    
    res.status(200).json({ status: 'ok', itemId: result })
    return
  }
  res.status(400).json({ status: "Payload type error" })
})

app.put("/api/items/update-item", checkAuthenticated, async (req, res) => {
  if (typeof req.body.dbayItem._id === "string" &&
      typeof req.body.dbayItem.itemName === "string" &&
      typeof req.body.dbayItem.createdBy === "string" &&
      typeof req.body.dbayItem.price === "number" &&
      typeof req.body.dbayItem.description === "string") {
    const item = await getItem(req.body.dbayItem._id)
    if (item == undefined) {
      res.status(400).json({ status: "Item not found" })
    }

    //User cannot create other user's item
    if (item.createdBy != (req.user as any).preferred_username && (req.user as any).roles != "Admin") {
      res.status(400).json({ status: "Don't have access to the item" })
      return
    }

    //Check price
    if (req.body.dbayItem.price <= 0) {
      res.status(400).json({ status: "Item price must be positive" })
      return
    }

    const updateResult = await updateItem(
      {
        _id: req.body.dbayItem._id,
        itemName: req.body.dbayItem.itemName,
        createdBy: item.createdBy,
        price: req.body.dbayItem.price,
        description: req.body.dbayItem.description
      }
    )

    if (updateResult == 0) {
      res.status(400).json( { status: "Cannot find the user's item with given id" } )
      return
    }
    else {
      res.status(200).json({ status: 'ok' })
      return
    }
  }
  res.status(400).json({ status: "Payload type error" })
})

app.put("/api/users/:username/profile", checkAuthenticated, async (req, res) => {
  if (typeof req.body.dbayUser.firstName === "string" &&
      typeof req.body.dbayUser.lastName === "string" &&
      typeof req.body.dbayUser.phone === "string" &&
      typeof req.body.dbayUser.address === "string") {
    if (req.params.username != (req.user as any).preferred_username) {
      res.status(400).json({ status: "User name does not match" })
      return
    }

    const updateResult = await updateUser(
      {
        firstName: req.body.dbayUser.firstName,
        lastName: req.body.dbayUser.lastName,
        phone: req.body.dbayUser.phone,
        address: req.body.dbayUser.address
      },
      req.params.username)
    if (updateResult == 0) {
      res.status(400).json( { status: "Cannot find the user" } )
      return
    }
    else {
      res.status(200).json({ status: 'ok' })
      return
    }
  }
  res.status(400).json({ status: "Payload type error" })
})

app.delete("/api/items/:itemid/remove-item", checkAuthenticated, async (req, res) => {
  let createdBy = (req.user as any).preferred_username
  if ((req.user as any).roles == "Admin") {
    const item = await getItem(req.params.itemid)
    if (item === undefined) {
      res.status(400).json({ status: "Cannot find the user's item with given id" })
      return
    }
    createdBy = item.createdBy
  }
  const deleteResult = await deleteItem(req.params.itemid, createdBy)
  if (deleteResult == 0) {
    res.status(400).json( { status: "Cannot find the user's item with given id" } )
  }
  else {
    res.status(200).json({ status: 'ok' })
  }
})

app.post("/api/items/:itemid/upload-image", checkAuthenticated, async (req, res) => {
  if (typeof req.body.imgStr !== "string") {
    res.status(400).json({ status: "payload error" })
    return
  }
  const item = await getItem(req.params.itemid)
  if (item === undefined) {
    res.status(400).json({ status: "Cannot find item with given id" })
    return
  }
  if (item.createdBy != (req.user as any).preferred_username) {
    res.status(400).json({ status: "User name does not match" })
    return
  }

  await addImage(req.params.itemid, uuidv4(), req.body.imgStr)

  res.status(200).json({ status: "ok" })
})

app.delete("/api/items/:itemid/remove-image/:imagename", checkAuthenticated, async (req, res) => {
  const item = await getItem(req.params.itemid)
  if (item === undefined) {
    res.status(400).json({ status: "Item with given id not found" })
    return
  }
  if (item.createdBy != (req.user as any).preferred_username && (req.user as any).roles != "Admin") {
    res.status(400).json({ status: "You don't have access to the image" })
    return
  }
  const deleteResult = await deleteImage(req.params.itemid, req.params.imagename)
  if (deleteResult == 0) {
    res.status(400).json({ status: "Image not found" })
    return
  }
  res.status(200).json({ status: "ok" })
})

app.post("/api/items/search", async (req,res) => {
  if ((req.body.searchType != "itemName" && req.body.searchType != "username") ||
      (req.body.sortBy != "createTime" && req.body.sortBy != "priceHighToLow" && req.body.sortBy != "priceLowToHigh") ||
      typeof req.body.keyword != "string") {
    res.status(400).json({ status: "payload error" })
    return
  }
  const searchResult = await searchItem(req.body.searchType, req.body.keyword, req.body.sortBy)
  res.status(200).json({ items: searchResult })
})

app.get("/api/images/:filename", async (req, res) => {
  const file = await images.findOne({_id: req.params.filename})
  if (file == null) {
    res.status(400).json({ status: "Image not found" })
    return
  }
  res.status(200).json({ status: "ok", imgStr: file.content })
}) 

app.post(
  "/api/logout", 
  (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err)
      }
      res.redirect("/")
    })
  }
)

// connect to Mongo
client.connect().then(() => {
  logger.info('connected successfully to MongoDB')
  db = client.db("test")
  customers = db.collection('customers')
  items = db.collection('items')
  admins = db.collection('admins')
  images = db.collection('images')

  Issuer.discover("http://127.0.0.1:8081/auth/realms/dbay/.well-known/openid-configuration").then(issuer => {
    const client = new issuer.Client(keycloak)
  
    passport.use("oidc", new Strategy(
      { 
        client,
        params: {
          // this forces a fresh login screen every time
          prompt: "login"
        }
      },
      async (tokenSet: any, userInfo: any, done: any) => {
        logger.info("oidc " + JSON.stringify(userInfo))

        const _id = userInfo.preferred_username
        const admin = await admins.findOne({ _id })
        if (admin != null) {
          userInfo.roles = "Admin"
        }
        else {
          const customer = await customers.findOne({ _id })
          if (customer == null) {
            await customers.insertOne(
              {
                _id,
                firstName: userInfo.given_name,
                lastName: userInfo.family_name,
                email: userInfo.email
              }
            )
          }
          userInfo.roles = "Customer"
        }
        return done(null, userInfo) 
      }
    ))

    app.get(
      "/api/login", 
      passport.authenticate("oidc", { failureRedirect: "/api/login" }), 
      (req, res) => res.redirect("/")
    )
    
    app.get(
      "/api/login-callback",
      passport.authenticate("oidc", {
        successRedirect: "/",
        failureRedirect: "/api/login",
      })
    )    

    // start server
    app.listen(port, () => {
      logger.info(`dbay server listening on port ${port}`)
    })
  })
})