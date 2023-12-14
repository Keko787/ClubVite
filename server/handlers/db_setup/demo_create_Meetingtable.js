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

  var sql = `CREATE TABLE meeting (
    ID INT PRIMARY KEY,
    date DATE,
    time TIME,
    location VARCHAR(255),
    name VARCHAR(255),
    club_Id INT,
    Attend_ID INT
);`;  // query to creat table
  con.query(sql, function (err, result) {  // runs query 
    if (err) throw err;
    console.log("Tables created");
  });
});