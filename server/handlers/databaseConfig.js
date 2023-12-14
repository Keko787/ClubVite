var mysql = require('mysql2/promise');

var pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "K$14k0457",
    database: "ClubVite1",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;