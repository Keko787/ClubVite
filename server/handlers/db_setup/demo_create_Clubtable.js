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

  var sql = `CREATE TABLE club (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255)
);`;  // query to creat table
  con.query(sql, function (err, result) {  // runs query 
    if (err) throw err;
    console.log("Tables created");
  });
});