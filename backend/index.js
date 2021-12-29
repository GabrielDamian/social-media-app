var mysql = require('mysql');
const cors = require('cors')
const express = require('express');
const { connect } = require('mssql');
const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

var con = mysql.createConnection({
  host: "sql11.freesqldatabase.com",
  user: "sql11455031",
  password: "VyRFQgb7c6",
  database: "sql11455031"
});
con.connect()



app.get('/',(req,res)=>{
  res.send("Server is working!")
})

app.post('/api/signup',(req,res)=>{
  // console.log('body',req.body);
  let username = req.body.username;
  let password = req.body.password;
  console.log("POST")

  
  con.query(`CREATE TABLE USERS (USER_ID NUMBER(4) PRIMARY KEY ,USERNAME VARCHAR(30), PASSWORD VARCHAR(30));`, function (err, data) {
    if (err) {
      return res.status(400);
    }
    console.log('The solution is: ', data);
    return res.send('noice')
  })
  
})



app.listen(PORT,()=>{
  console.log(`App is listenint at port ${PORT}`)
})

