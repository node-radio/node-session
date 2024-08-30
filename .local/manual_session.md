# The Procedures 4.4 ft-anywhere-fitness-06

##  Welcome to Deployment and Best Practices! :partying_face:

-   Please sign up for an account on [Heroku](https://id.heroku.com/login)
-   Go through the motions of installing the [Heroku-CLI](https://devcenter.heroku.com/articles/heroku-cli#download-and-install)

## the procedures to build server - Use this -template

- [ ] click "Use this template"

- [ ] remove .git & connect remote repo

    ```
    rm -rf .git

    git init
    ```
  - [ ] Reference git commands
      ```
      git remote add origin git@github.com:webagora/ft-anywhere-fitness-06
      ```
      - …or create a new repository on the command line
      ```
      echo "# newrepo" >> README.md
      git init
      git add README.md
      git commit -m "first commit"
      git branch -M main
      git remote add origin git@github.com:beatlesm/newrepo.git
      git push -u origin main
      ```
      - …or push an existing repository from the command line
      ```
      git remote add origin git@github.com:beatlesm/newrepo.git
      git branch -M main
      git push -u origin main
      ```
      ```
      heroku login

      heroku git:remote -a fitness-06

      git push heroku main 

      heroku logs -a web49rocks --tail
      ```
      ```
      git remote -v

      git remote show origin
      ```

- Create git local folder `git init`
  - global config if needed
    ```
    git config --global user.name "beatlesm" 
    git config --global user.email "rj.geng@gmail.com"
    ```
  - Create a `.gitignore` file executing `npx gitignore node`
  - Create a `package.json` file executing `npm init --y`
  - Add Eslint to the project executing `npx eslint --init`
    ```
    npx eslint --init
    ```
  - Add jest executing `npx jest --init`
    ```
    npx jest --init
    ```
  - Edit the `package.json` file to add `"start"` , `"server"` `"migrate"`, `"rollback"`, `"resetdb"` and `"seed"` scripts
    ```
        "start": "node index.js",
        "server": "nodemon index.js",
        "migrate": "knex migrate:latest",
        "rollback": "knex migrate:rollback",    
        "seed": "knex seed:run",
        "resetdb": "npm run rollback && npm run migrate && npm run seed",
        "test": "cross-env NODE_ENV=testing jest --verbose --runInBand"
    ```
  - Install `express`, `dotenv`, `cors`, `helmet`, `knex`, `sqlite3`, `bcryptjs`, `express-session`, `connect-session-knex` `jsonwebtoken` in dependencies
    ```
        npm install express dotenv cors helmet knex @vscode/sqlite3 bcryptjs express-session connect-session-knex jsonwebtoken
    ```
  - Install  `nodemon`, `knex-cleaner`, `eslint` `jest` `@types/jestin` `supertest`, `cross-env` devDependencies
    ```
        npm install -D nodemon knex-cleaner jest @types/jest supertest cross-env
    ```
  
  - Add support for environment variables using an `.env` file and the dotenv library, providing fallbacks in the code
    - .env
    ```
    PORT=9000    
    NODE_ENV=development
    JWT_SECRET='make it long, random, and very secret'
    ```

- [ ] Build a simple API:

  
    -   index.js
    ```
    const server = require('./api/server.js');
    const { PORT } = require('./api/secrets')

    server.listen(PORT, () => {
      console.log(`Listening on port ${PORT}...`);
    });
    ```
    -   index.js --> /secret/index.js
    ```
    const server = require('./api/server')
    const { PORT } = require('./secret')

    server.listen(PORT, () => {
      console.log(`\n** Running on port ${PORT} **\n`)
    })
    ```
    -    /secret/index.js
    ```
    require('dotenv').config() 

    module.exports = {
      BCRYPT_ROUNDS: process.env.BCRYPT_ROUNDS || 8,
      NODE_ENV: process.env.NODE_ENV || 'development',
      PORT: process.env.PORT || 9000,
      // JWT_SECRET: process.env.TOKEN_SECRET || 'ssh'
      SECRET: process.env.SECRET || 'keep it secret!!!!!',
      JWT_SECRET: process.env.JWT_SECRET || 'keep it secret!!!!!'
    }
    ```

    -   server.js  for **session**
    ```
    const path = require('path')
    const express = require('express')
    const helmet = require('helmet')
    const session = require('express-session')
    const Store = require('connect-session-knex')(session)

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
    ```

- [ ] Login Heroku CLI 
    ```
    heroku --version

    heroku login    

    heroku git:remote -a ft-anywhere-fitness-06
    ```

- [ ] Add-ons 

  -  Resources --> Add-ons: chose: Heroku Postgres
  -  Install PostgreSQL locally and create the database by pgAdmin 4 

- [ ] create and build .env:
  
  - .env  - copy from knexfile.js --> change password to your PostgreSQL password
    ```
    PORT=9000    
    NODE_ENV=development
    JWT_SECRET='make it long, random, and very secret'
    //  DEV_DATABASE_URL=postgresql://postgres:password@localhost:5432/database_name
    //  TESTING_DATABASE_URL=postgresql://postgres:password@localhost:5432/testing_database_name
    DEV_DATABASE_URL=postgresql://postgres:2246@localhost:5432/ft-anywhere-fitness-06
    TESTING_DATABASE_URL=postgresql://postgres:2246@localhost:5432/ft-anywhere-fitness-06_test
    ```
- [ ] config the package.json for Heroku: 
    ```
    "migrateh": "heroku run knex migrate:latest -a YOUR_HEROKU_APP_NAME",
    "rollbackh": "heroku run knex migrate:rollback -a YOUR_HEROKU_APP_NAME",
    "databaseh": "heroku pg:psql -a YOUR_HEROKU_APP_NAME",
    "seedh": "heroku run knex seed:run -a YOUR_HEROKU_APP_NAME",
    ```
    ```
    "start": "node index.js",
    "server": "nodemon index.js",
    "migrate": "knex migrate:latest",
    "rollback": "knex migrate:rollback",
    "seed": "knex seed:run",
    
    "migrateh": "heroku run knex migrate:latest -a ft-anywhere-fitness-06",
    "rollbackh": "heroku run knex migrate:rollback -a ft-anywhere-fitness-06",
    "databaseh": "heroku pg:psql -a ft-anywhere-fitness-06",
    "seedh": "heroku run knex seed:run -a ft-anywhere-fitness-06",
    "test": "cross-env NODE_ENV=testing jest --verbose --runInBand",
    "deploy": "git push heroku main"
    ```
- [ ] The local psql command could not be located: 

    ```
    export PATH="/Library/PostgreSQL/14/bin/:$PATH"
    ```



- [ ] Install `knex@0.95.15` and `sqlite3` 
    ```
    npm install knex@0.95.15 sqlite3
    ```
    **Note**

    **Reminder, if you bootstrap a project from scratch, you must use `knex` and `@vscode/sqlite3` instead of `knex` and `sqlite3`**

    This is because the newest version of Knex (1.0.1) expects a different sqlite3 library (the one with the @vscode in the name).
    Inside the code there is no difference. Everything should be identical with the new driver.

    If you experience breakage with the new libraries (like `node-gyp` errors etc), use `knex@0.95.15` and `sqlite3` instead (the old libs)

    ```
    npm show knex versions

    npm uninstall knex @vscode/sqlite3 
    ```
- [ ] Generate knexfile.js by `npx knex init` 

  - knexfile.js for **Sqlite3**
  ```
  module.exports = {
    development: {
      client: 'sqlite3',
      useNullAsDefault: true,
      connection: {
        filename: './database/auth.db3',
      },
      pool: {
        afterCreate: (conn, done) => {
          conn.run('PRAGMA foreign_keys = ON', done)
        },
      },
      migrations: {
        directory: './database/migrations',
      },
      seeds: {
        directory: './database/seeds',
      },
    },

    production: {
      client: "sqlite3",
      useNullAsDefault: true,
      connection: {
        filename: './database/auth.db3',
      },
      pool: {
        afterCreate: (conn, done) => {
          conn.run("PRAGMA foreign_keys = ON", done);
        },
      },
      migrations: {
        directory: './database/migrations',
      },
      seeds: {
        directory: './database/seeds',
      },
    },  
  }
  ```

  - knexfile.js for **PostGresql**
  ```
  require('dotenv').config()
  /*
    PORT=9000
    NODE_ENV=development
    DEV_DATABASE_URL=postgresql://postgres:password@localhost:5432/database_name
    TESTING_DATABASE_URL=postgresql://postgres:password@localhost:5432/testing_database_name
    Put the above in your .env file. Some adjustments in the connection URLs will be needed:
      - 5432 (this is the default TCP port for PostgreSQL, should work as is and can be omitted)
      - postgres (in postgres:password, this is the default superadmin user, might work as is)
      - password (in postgres:password, replace with the actual password of the postgres user)
      - database_name (use the real name of the development database you created in pgAdmin 4)
      - testing_database_name (use the real name of the testing database you created in pgAdmin 4)
  */
  const pg = require('pg')

  if (process.env.DATABASE_URL) {
    pg.defaults.ssl = { rejectUnauthorized: false }
  }

  const sharedConfig = {
    client: 'pg',
    migrations: { directory: './api/data/migrations' },
    seeds: { directory: './api/data/seeds' },
  }

  module.exports = {
    development: {
      ...sharedConfig,
      connection: process.env.DEV_DATABASE_URL,
    },
    testing: {
      ...sharedConfig,
      connection: process.env.TESTING_DATABASE_URL,
    },
    production: {
      ...sharedConfig,
      connection: process.env.DATABASE_URL,
      pool: { min: 2, max: 10 },
    },
  ```
  
- [ ] build db-config.js file 

  - db-config.js
    ```
    const knex = require('knex') // 

    const configs = require('../knexfile')

    // on Heroku, process.env.NODE_ENV will be 'production'
    const env = process.env.NODE_ENV || 'development'

    // we need [ ] when object prop is a variable
    const config = configs[env]

    module.exports = knex(config)
    ```
- [ ] Generate a new migration file by  `npx knex migrate:make [migration-name]`
  ```
  npx knex migrate:make first-migration
  ```
- [ ] Update a newly created migration file:

    -  20220121035105_first-migration.js 

    ```
    exports.up = function (knex) {
      return knex.schema
        .createTable('roles', roles => {
          roles.increments('role_id')
          roles.string('role_name', 32).notNullable().unique()
        })
        .createTable('users', users => {
          users.increments('user_id')
          users.string('username', 128).notNullable().unique()
          users.string('password', 128).notNullable()
          users.integer('role_id')
            .unsigned()
            .notNullable()
            .references('role_id')
            .inTable('roles')
            .onUpdate('RESTRICT')
            .onDelete('RESTRICT')
        })
    }

    exports.down = function (knex) {
      return knex.schema
        .dropTableIfExists('users')
        .dropTableIfExists('roles')
    }
    ```
- [ ] create a seeds file by `npx knex seed:make 02-users` ;

    - users.js
    ```
    exports.seed = async function (knex) {
      await knex('users').truncate()
      await knex('roles').truncate()
      await knex('roles').insert([
        { role_name: 'admin' },
        { role_name: 'instructor' },
        { role_name: 'client' },        
      ])
      await knex('users').insert([
        {
          username: 'bob',
          password: '$2a$10$dFwWjD8hi8K2I9/Y65MWi.WU0qn9eAVaiBoRSShTvuJVGw8XpsCiq', // password "1234"
          role_id: 1,
        },
        {
          username: 'sue',
          password: '$2a$10$dFwWjD8hi8K2I9/Y65MWi.WU0qn9eAVaiBoRSShTvuJVGw8XpsCiq', // password "1234"
          role_id: 3,
        },
      ])
    }
    ```  