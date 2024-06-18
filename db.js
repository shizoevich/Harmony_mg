
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    password: '1234',
    host: '213.109.233.84',
    port: 5432,
    database: 'psychoemotional'
})

module.exports = pool