var pg = require('pg');

const connectionString = "postgres://postgres:7CnaH1Gghs0J32L@sdprojectdb.internal:5432/postgres"
const Pool = pg.Pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:7CnaH1Gghs0J32L@sdprojectdb.internal:5432/postgres',
    ssl: process.env.DATABASE_URL ? true : false
})

module.exports = pool;