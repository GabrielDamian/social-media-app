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


    //daca username-ul nu exista
    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

  
    //making a new user

    //determina cati users sunt in db a.i sa poate face incrementare dinamic, chiar si cand backend intra in throw error si vr restart

    current_users_in_db = 0
    con.query(`select * from users;`, function  (err, data) {
      if (err) {
        console.log('eroare la numarare users in db')
        return res.status(400).send(err);
      }
      
      console.log("Data counter MAAAAAAN:")
      console.log(data.length)
      current_users_in_db = data.length

    
    current_users_in_db++;
    console.log('adaug user nou cu id counter:', current_users_in_db);

    con.query(`insert into users values (${current_users_in_db}, '${username}', '${hashPassword}');`, function  (err, data) {
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
  });

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



app.post('/api/delete-item',async (req,res)=>{

  let id = req.body.id;
  let table = req.body.table;

  console.log('date delete:', id,table);
  //delete from users where ID = '7';
  con.query(`delete from ${table} where ID = '${id}';`, async  (err, data)=> {
    if (err || data.length == 0) {
      return res.status(400).send(err);
    }

    console.log('aici:',data)
    res.json({
      'lines': data
    })

  });

});


app.post('/api/update-item-users',async (req,res)=>{
  let id = req.body.id;
  let username = req.body.username;
  let password = req.body.password;

  con.query(`update users
    set username = '${username}', password_token='${password}'
    where ID =${id};`, async  (err, data)=> {
    
      if (err || data.length == 0) {
      return res.status(400).send(err);
    }

    console.log('aici:',data)
    res.json({
      'lines': data
    })
  });
});




app.post('/api/fetch-table-desc',async (req,res)=>{


  con.query(`select * from description;`, async  (err, data)=> {
    if (err || data.length == 0) {
      return res.status(400).send(err);
    }

    console.log('aici:',data)
    res.json({
      'lines': data
    })

  });

});



app.post('/api/delete-item-desc',async (req,res)=>{

  let id = req.body.id;

  //delete from users where ID = '7';
  con.query(`delete from description where user_id ='${id}';`, async  (err, data)=> {
    if (err || data.length == 0) {
      return res.status(400).send(err);
    }

    console.log('aici:',data)
    res.json({
      'lines': data
    })

  });

});



app.post('/api/update-item-desc',async (req,res)=>{

  let id = req.body.user_id;
  let desc_val = req.body.desc_val;


  console.log('update in desc val', id, desc_val);
  
  con.query(`update description
    set description_val = '${desc_val}'
    where user_id =${id};`, async  (err, data)=> {
    
      if (err || data.length == 0) {
      return res.status(400).send(err);
    }

    console.log('aici:',data)
    res.json({
      'lines': data
    })
  });
});


app.post('/api/insert-item-desc',async (req,res)=>{

  let user_id = req.body.user_id;
  let desc_val = req.body.desc_val;

  console.log('insert item desc:', user_id, desc_val);
//   insert into description
// values(3,'desc for user 3');
    con.query(` insert into description values(${user_id},'${desc_val}');`, async  (err, data)=> {

      if (err || data.length == 0) {
      return res.status(400).send(err);
    }

    console.log('aici:',data)
    res.json({
      'lines': data
    })
    });

});

app.post('/api/fetch-table-status',async (req,res)=>{

  con.query(`select * from status;`, async  (err, data)=> {

    if (err || data.length == 0) {
    return res.status(400).send(err);
  }

    console.log('fetch status table:',data)
    res.json({
      'lines': data
    })
    });
});

app.post('/api/delete-table-status',async (req,res)=>{

  console.log('delete from table status')
  let user_id = req.body.user_id;
  let status_val = req.body.status_val;

  console.log(user_id, status_val);

  con.query(`delete from status where user_id = ${user_id} and status_value = '${status_val}';`, async  (err, data)=> {

    if (err || data.length == 0) {
    return res.status(400).send(err);
  }

    console.log('fetch status table:',data)
    res.json({
      'lines': data
    })
    });

});

app.post('/api/insert-item-status',async (req,res)=>{
  let user_id = req.body.user_id;
  let new_status = req.body.status_val;
  console.log('add status value')
  console.log(user_id, new_status)
//insert into status values (1, 'ceva');

con.query(`insert into status values (${user_id}, '${new_status}');`, async  (err, data)=> {

  if (err || data.length == 0) {
  return res.status(400).send(err);
  }

    console.log('add status table:',data)
    res.json({
      'lines': data
    })
    });

});
//update status
// set status_value ='BadKarma'
// where user_id = 7 and status_value='Buttercup';
app.post('/api/update-item-status',async (req,res)=>{
  let user_id = req.body.user_id;
  let new_status = req.body.new_status_val;
  let old_status = req.body.old_status_val;

  console.log('update status value')
  console.log(user_id, new_status,old_status)

  
  con.query(`update status
  set status_value ='${new_status}'
  where user_id = ${user_id} and status_value='${old_status}';`, async  (err, data)=> {

    if (err || data.length == 0) {
    return res.status(400).send(err);
    }

    console.log('add status table:',data)
    res.json({
      'lines': data
    })
    });

});


//POSTS SECTION
app.post('/api/fetch-table-posts',async (req,res)=>{

  con.query(`select * from posts;`, async  (err, data)=> {

    if (err || data.length == 0) {
    return res.status(400).send(err);
    }

    console.log('fetch table posts:',data)
    res.json({
      'lines': data
    })
    });

});


app.post('/api/delete-table-posts',async (req,res)=>{

  let post_id = req.body.post_id;
  let post_value = req.body.post_value;
  let user_id = req.body.user_id;

  console.log('delete post route:', post_id, post_value, user_id)
  con.query(`delete from posts where
  post_id = ${post_id} and post_value = '${post_value}' and by_user_id=${user_id};`, async  (err, data)=> {

    if (err || data.length == 0) {
    return res.status(400).send(err);
    }

    console.log('fetch table posts:',data)
    res.json({
      'lines': data
    })
    });

});

app.post('/api/add-table-posts',async (req,res)=>{

  let post_id = null;
  //!!post id  = len(posts) + 1
  //determinat prin alt query

  let post_value = req.body.post_value;
  let user_1 = req.body.user_1;
  let user_2 = req.body.user_2;

  console.log('add table posta before data:', post_value, user_1, user_2)

  con.query(`select * from posts;`, async  (err, data)=> {

    if (err ) {
    return res.status(400).send(err);
    }
    post_id = data.length;
    console.log("POST_id dinamic:",post_id)


      con.query(`insert into posts
      values(${post_id},'${post_value}',${user_1});`, async  (err, data)=> {

        if (err || data.length == 0) {
        return res.status(400).send(err);
        }

        
        //adauga si celalalt user
        con.query(`insert into posts
        values(${post_id},'${post_value}',${user_2});`, async  (err, data)=> {
  
          if (err || data.length == 0) {
          return res.status(400).send(err);
          }
  
          res.json({
            'lines': data
          })
          
        });

      });

    
    });
  
});

app.post('/api/update-table-posts',async (req,res)=>{

  let post_id = req.body.post_id;
  let new_post_val = req.body.new_post_val;

  console.log('update post route:', post_id, new_post_val)
  con.query(`update posts
  set post_value='${new_post_val}'
  where post_id = ${post_id};`, async  (err, data)=> {

    if (err || data.length == 0) {
    return res.status(400).send(err);
    }

    console.log('fetch table posts:',data)
    res.json({
      'lines': data
    })
    });

});


app.post('/api/fetch-specific-userame',async (req,res)=>{
  let id = req.body.id;
  console.log("fetch specific user:", id)
  

  con.query(`select * from users where ID=${id}`, async  (err, data)=> {

    if (err || data.length == 0) {
    return res.status(400).send(err);
    }

    console.log('fetch custom user id:',data)
      res.json({
        username: data[0].username
      })

    });
})

app.post('/api/fetch-specific-description',async (req,res)=>{

  let id = req.body.id;
  console.log("fetch specific description:", id)
  

  con.query(`select description_val from description where user_id =${id};`, async  (err, data)=> {

    if (err || data.length == 0) {
    return res.status(400).send(err);
    }

    console.log('fetch custom user id:',data)
      res.json({
        desc: data[0].description_val
      })

    });


})
//select status_value from status where user_id =1;
app.post('/api/fetch-specific-status',async (req,res)=>{

  let id = req.body.id;
  console.log("fetch specific description:", id)
  

  con.query(`select status_value from status where user_id = ${id};`, async  (err, data)=> {

    if (err || data.length == 0) {
    return res.status(400).send(err);
    }

    console.log('fetch custom user id:',data)
      res.json({
        status: data[0].status_value
      })

    });


})
app.listen(PORT,()=>{
  console.log(`App is listenint at port ${PORT}`)
})

