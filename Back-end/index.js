const express = require('express')
const cors = require("cors")
const mysql = require('mysql2')
const app = express()
app.use(cors())
app.use(express.json())

app.listen(3004, () => {
    console.log("Server is running at loc")
})


const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "cion_careers",
})

connection.connect((err) => {
    if (err) {
      console.error("Error connecting to database: " + err.stack);
      return;
    }
    console.log("Connected to database as id " + connection.threadId);
});

app.post("/add-roleDetails", (req, res) => {
    const { department, role, location, experiences, Eligibility, skill_required, job_description, hiring_manager, hiring_manager_email, role_logo_url } = req.body;
    connection.query(
      `INSERT INTO careers (department, role, location, experience, Eligibility, skill_required, job_description, hiring_manager, hiring_manager_email, role_icon_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [department, role, location, experiences, Eligibility, skill_required, job_description, hiring_manager, hiring_manager_email, role_logo_url],
      (err, results) => {
        if (err) {
          console.error('Error executing query', err);
          return res.status(500).send('Internal Server Error');
        }
        return res.status(200).send('Role details added successfully');
      }
    );
  });

  app.post("/Submit-ApplicantDetails",(req,res)=>{
    const { role,role_id,department,name,dob,highest_graduation, graduation_year, cgpa, current_address, mobile_number, email_id, experience, reason_for_applying, cv_uploaded} = req.body;
    connection.query(
      ` INSERT INTO applicants (role_id,role,department,applicant_name,mobile_number,email,years_of_experience,
        DOB,highest_graduation,graduation_year,CGPA,current_address,reason_for_applying,CV_uploaded
      )VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [role_id,role,department,name,mobile_number,email_id,experience,dob,highest_graduation,graduation_year,cgpa,current_address,reason_for_applying,cv_uploaded],(err,results)=>{
        if(err){
            console.error('Error executing query', err);
            return res.status(500).send('Internal Server Error');
        }
        return res.status(200).send('Applicant details added successfully');
    })
  })
  
  app.get("/show-roleDetails", (req, res) => {
    connection.query(`SELECT * FROM careers ORDER BY role_id DESC;`, (err, results) => {
        if (err) {
            console.error('Error executing query', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length === 0) {
            return res.status(404).send('No data found');
        }
        return res.status(200).json(results);
    });
});

app.get("/get-JDDetails/:id",(req,res)=>{
    const {id} = req.params
    connection.query(`SELECT role,role_id,job_description,skill_required,department,Eligibility,experience,location FROM careers WHERE role_id = ${id}`,(err,results)=>{
        if(err){
            console.error('Error executing query', err);
            return res.status(500).send('Internal Server Error');
        }
        if(results.length === 0){
          return res.status(500).send('No data found');
        }
        return res.status(200).json(results);
    })
})

app.post("/applicant-login", (req, res) => {
  const { email_id, password } = req.body;
  connection.query(
    `SELECT * FROM applicant_credentials WHERE applicant_email = ? and applicant_password=?`,
    [email_id ,password],
    (err, results) => {
      if (err) {
        console.error('Error executing query', err);
        return res.status(500).send('Internal Server Error');
      }
      if (results.length === 0) {
        return res.status(401).send({
          msg: "invalid credentials"
        });      }
      const user = results[0];
      if (password !== user.applicant_password) {
        return res.status(401).send({
          msg: "invalid credentials"
        });
      }
      return res.status(200).send('Login successful');
    }
  );
});


app.post("/add_applicant-credentials",(req,res)=>{
  const {applicant_name,applicant_email,applicant_password} = req.body;

  connection.query(
    `SELECT * FROM applicant_credentials WHERE applicant_email = ?`,[applicant_email],
    (err, results) => {
      if (err) {
        console.error('Error executing query', err);
        return res.status(500).send('Internal Server Error');
      }
      if (results.length > 0) {
        return res.status(400).send('Email already exists');
      }
      connection.query(
        `INSERT INTO applicant_credentials (applicant_name, applicant_email, applicant_password) VALUES (?, ?, ?)`,
        [applicant_name, applicant_email, applicant_password],
        (err, results) => {
          if (err) {
            console.error('Error executing query', err);
            return res.status(500).send('Internal Server Error');
          }
          return res.status(200).send('Applicant details added successfully');
        }
      );
    }
  );
});