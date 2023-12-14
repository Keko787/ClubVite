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

  var sql = `CREATE TABLE attendance (
            ID INT AUTO_INCREMENT PRIMARY KEY,
            roster_id INT,
            meeting_id INT,
            member VARCHAR(255),
            isAttended BOOLEAN,
            FOREIGN KEY (roster_id) REFERENCES roster(ID),
            FOREIGN KEY (meeting_id) REFERENCES meeting(ID)
);`;  // query to creat table
  con.query(sql, function (err, result) {  // runs query 
    if (err) throw err;
    console.log("Tables created");
  });
});