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

  var sql = `CREATE TABLE roster (
            ID INT PRIMARY KEY,
            year INT,
            club_id INT,
            member_id INT,
            isOfficer BOOLEAN
);`;  // query to creat table
  con.query(sql, function (err, result) {  // runs query 
    if (err) throw err;
    console.log("Tables created");
  });
});