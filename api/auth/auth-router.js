const router = require('express').Router()
const bcrypt = require('bcryptjs')
const { BCRYPT_ROUNDS } = require('../../secret')
const { add, findBy } = require('../users/users-model')
const validatePayload = (req, res, next) => { next() }

router.post('/register', validatePayload, async (req, res, next) => {
    try {
        // pull credentials from req.body
        const { username, password } = req.body
        // hash the password w/ bcrypt
        const hash = bcrypt.hashSync(password, BCRYPT_ROUNDS) // 2 ^ 8
        // store new user in db
        const newUser = { username, password: hash }
        const inserted = await add(newUser)
        // respond
        res.status(201).json({ message: `Welcome, ${inserted.username}` })
        // res.status(201).json(inserted)
    } catch (err) {
        next (err)
    }
})
router.post('/login', validatePayload, async (req, res, next) => {
    try {
        // pull u/p from req.body
        const { username, password } = req.body
        // pull the user from the db by that username
        const [user] = await findBy({ username })
    
        if (user && bcrypt.compareSync(password, user.password)) {
          // password good, we can initialize a session!
          req.session.user = user 
          //   1- a cookie will be set on the client with a sessionId
          //   2- the sessionId will also be stored in the server (the session)         
          res.json({ message: `Good to see you again, ${username}` })
          // res.json( user )
        } else {
          next({ status: 401, message: 'Invalid credentials' })
        }
        // server recreates hash from req.body.password // xxxxxxxxxxx
        // server compares 'recreated' against the one in db
      } catch (err) {
        next(err)
      }
})
router.get('/logout', validatePayload, async (req, res, next) => {
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        res.json({ message: `sorry, could you retry` })        
      } else {
        // set a new cookie in THE PAST
        res.set('Set-Cookie', 'monkey=; SameSite=Strict; Path=/; Expires=Thu, 01 Jan 1970 00:00:00')
        res.json({ message: `bye, it was awesome` })        
      }
    })
  } else {
    res.json({ message: `I do not believe we have met?` })
  }
})


module.exports = router