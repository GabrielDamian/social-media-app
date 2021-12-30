var mysql = require('mysql');
const cors = require('cors')
const express = require('express');
const { connect } = require('mssql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

let TOKEN_SECRET = 'wkfkfsbcnajbskascbasjknakcbjhsvclskbc'

let incrementer_user_id = 102;

var con = mysql.createConnection({
  host: "localhost",
  database: "social_media",
  user: "root",
  password: "root",
});
con.connect()



app.get('/',(req,res)=>{
  res.send("Server is working!")
})

app.post('/api/signup',async (req,res)=>{

  let username = req.body.username;
  let password = req.body.password;
  console.log("Sign up cu datele:",username, password)


  //verifica daca username-ul exista deja (daca da,trimite status code 400 inapoi)
  con.query(`select username from users where username = '${username}';`, async  (err, data)=> {
    if (err) {
      return res.status(400).send(err);
    }

    if(data.length !=0)
    {
      console.log('username deja existent, intorc status 400')
      return res.status(400).send(err);
    }

    //in acest punct, usernameul este unic si il putem inregistra in db

    console.log('s-a ajuns aici')

    //daca username-ul nu exista
    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

  
    //making a new user
    console.log('aici 2')
  
    incrementer_user_id++;

    //determina cati users sunt in db a.i

    console.log('incrmetn id:', incrementer_user_id)
    con.query(`insert into users values (${incrementer_user_id}, '${username}', '${hashPassword}');`, function  (err, data) {
      if (err) {
        console.log('eroare la adaugare user nou in db')
        return res.status(400).send(err);
      }
      console.log('aici 3')
      
      console.log("User adaugat cu succes!")
      console.log(data)
  
  
      con.query(`select * from users where username = '${username}';`, async(err, data) =>{
        if (err) {
          console.log('eroare la ultim fetch din register')
          return res.status(400).send(err);
        }
        console.log('dupa adaugare user:', data)
        id = data[0]['ID']
        
        try{
            const token = jwt.sign({_id: id}, TOKEN_SECRET)
            res.json(token);
  
          }catch(err)
          {
              res.status(400).send(err);
          }
    
      })
  
    })
  

  })
 
 
})

app.post('/api/login',async (req,res)=>{

  let username = req.body.username;
  let password = req.body.password;
  console.log('login route cu :', username, password)

  //gaseste username is pass token in db

  con.query(`select * from users where username = '${username}';`, async  (err, data)=> {
    if (err) {
      return res.status(400).send(err);
    }

    if(data.length == 0)
    {
      console.log('username nu exista in db, intor 400')
      return res.status(400).send(err);
    }
    console.log('username exista:', data)
    let db_pass_token = data[0]['password_token'];
    let user_id = data[0]['ID'];

    //valideaza parole
    console.log('vr sa validez:', db_pass_token);

    //Password is correct
    const validPass = await bcrypt.compare(password, db_pass_token)
    if(!validPass) return res.status(400).send('parola gresita');

    console.log('parole valide')
    //parolele se protrivesc, intorc token pentru local storage

    const token = jwt.sign({_id: user_id}, TOKEN_SECRET)
    res.json(token);
  })

  
})

app.post('/api/verify-token',async (req,res)=>{

  console.log('verify token')
  const token = req.body.token;
  
  if(!token) {
    res.status(401).send("Acces denied!")
    
  }
  else
  {
      try{
          const verified = jwt.verify(token, TOKEN_SECRET)
          res.json(verified);

      }catch(err)
      {
          res.status(400).send("Invalid token!")
  }
}

})

app.post('/api/fetch-table-users',async (req,res)=>{

  console.log('fetch-table');
  con.query(`select * from users;`, async  (err, data)=> {
    if (err || data.length == 0) {
      return res.status(400).send(err);
    }

    console.log('aici:',data)
    res.json({
      'lines': data
    })

  });
});


app.listen(PORT,()=>{
  console.log(`App is listenint at port ${PORT}`)
})

