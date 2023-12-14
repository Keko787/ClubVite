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

  var sql = `CREATE TABLE admin (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    password VARCHAR(255), -- You may want to hash passwords for security
    club_ID INT,
    roster_id INT,
    FOREIGN KEY (club_ID) REFERENCES club(ID),
    FOREIGN KEY (roster_id) REFERENCES roster(ID)
);`;  // query to creat table
  con.query(sql, function (err, result) {  // runs query 
    if (err) throw err;
    console.log("Tables created");
  });
});