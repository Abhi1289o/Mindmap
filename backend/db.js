const { Pool } = require('pg');

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "mindmapdb",
    password: "mindmapsql",
    port:5432
});

module.exports = pool;