var mysql = require('mysql2');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "K$14k0457",
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

  con.query("CREATE DATABASE ClubVite1", function (err, result) {  // uses the query to create a db
    if (err) throw err;
    console.log("Database created");
  });
});