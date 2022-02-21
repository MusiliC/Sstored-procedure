const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "learners",
  multipleStatements: true,
});


//CREATING GET METHOD

app.get('/learners', (req,res) =>{
    db.query('select * from learnerdetails', (err,rows, fields) =>{
        if(!err)
        res.send(rows);
        else
        console.log(err);
    })
})

//Get a specific id

app.get('/learners/:id', (req,res) =>{
    db.query("Select  * from learnerdetails where learner_id =? ", [req.params.id], (err, rows, fields) =>{
        if(!err)
        res.send(rows);
        else
        console.log(err);
    })
})


//INSERT OR POST USER

app.post('/learners', (req,res) =>{
    let learner = req.body;

    var sql =
      "SET @learner_id = ? ; SET @learner_name = ?; SET @learner_email = ?; SET @course_id = ?; CALL learnerAddorEdit(@learner_id, @learner_name, @learner_email, @course_id);";
      db.query(sql, [learner.learner_id, learner.learner_name, learner.learner_email, learner.course_id], (err,rows,field) =>{
        if(!err)
        rows.forEach(element => {
          if(element.constructor == Array)
          res.send('New learner ID: ' + element[0].learner_id);
        });
        else
        console.log(err);
      })
})

//UPDATE CODE

app.put('/learners', (req, res) =>{
  let learner = req.body;

  var sql =
    "SET @learner_id = ?; SET @learner_name = ?; SET @learner_email = ?; SET @course_id = ?;CALL learnerAddorEdit(@learner_id , @learner_name, @learner_email, @course_id);";
    db.query(sql, [learner.learner_id, learner.learner_name, learner.learner_email, learner.course_id], (err, rows, fields) =>{
      if(!err)
      res.send('Learner details updated successfully');
      else
      console.log(err);
    });
})

app.delete('/learners/:id', (req,res) =>{
  db.query('DELETE from learnerdetails where learner_id =? ', [req.params.id], (err, rows, fields) =>{
    if(!err)
    res.send('Learner deleted successfully')
    else
    console.log(err);
  })
})

db.connect(function (err) {
  if (err) throw err;
  console.log("connected!!");
});

app.listen(3001, () => {
  console.log("listening to port 3001");
});