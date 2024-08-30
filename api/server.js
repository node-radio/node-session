const path = require('path')
const express = require('express')
const helmet = require('helmet')
const session = require('express-session')
const Store = require('connect-session-knex').ConnectSessionKnexStore; // Correct class import

const usersRouter = require('./users/users-router.js')
const authRouter = require('./auth/auth-router')

const server = express()

server.use(express.static(path.join(__dirname, '../client')))
server.use(helmet())
server.use(express.json())
server.use(session({
  name: 'monkey', // the name of the sessionID
  secret: process.env.SECRET  || 'keep it secret',
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false, // in prod it should be true (if true, only over HTTPS)
    httpOnly: false, // make it true if possible (if true, the javascript cannot read the cookie)
  },
  rolling: true, // push back the expiration date of cookie
  resave: false, // ignore for now
  saveUninitialized: false, // if false, sessions are not stored "by default" // important it be GDPR
  store: new Store({
    knex: require('../database/db-config'),
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 1000 * 60 * 60,
  })
}))

server.use('/api/users', usersRouter)
server.use('/api/auth', authRouter)

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client', 'index.html'))
})

server.use('*', (req, res, next) => {
  next({ status: 404, message: 'not found!' })
})

server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  })
})

module.exports = server