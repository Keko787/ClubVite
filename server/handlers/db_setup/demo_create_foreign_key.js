var mysql = require('mysql2');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "K$14k0457",
  database: "ClubVite1"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

  var sql = "INSERT INTO user (name, pin, username) VALUES ('test user', 'test123', 'testUser');";  // query to make primary key on table
  con.query(sql, function (err, result) {  // runs the query
    if (err) throw err;
    console.log("Table altered");
  });
});