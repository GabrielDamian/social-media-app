var mysql = require('mysql');

var con = mysql.createConnection({
  host: "sql11.freesqldatabase.com",
  user: "sql11455031",
  password: "VyRFQgb7c6",
  database: "sql11455031"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("SELECT * FROM TEST_TABLE", function (err, result,fields) {
    console.log(ceva);
  });
});