const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();
app.use(cors());
app.use(express.json());
const jwt = require("jsonwebtoken");
const { hash, compare } = require("bcrypt");
const TokenKey = "xyzzyx12345";
const nodemailer = require("nodemailer")
require("dotenv").config();



app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});


app.listen(3004, () => {
  console.log("Server is running at loc");
});

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "cion_careers",
});


const userAuthentication = (request, response, next) => {
  try {
    const authorization = request.headers.authorization;
    let token;
    if (authorization !== undefined) {
      token = authorization.split(" ")[1];
    }
    console.log(token)
    if (token === undefined) {
      response.status(400);
      response.send({ msg: "Missing Token" });
    } else {
      jwt.verify(token,TokenKey, (err, payload) => {
        if (err) {
          response.status(400);
          response.send({ msg: "Invalid Token" });
        } else {
          request.email_id = payload.email_id;
          request.password = payload.password;
          next();
        }
      });
    }
  } catch (error) {
    console.log(`Error occured in Middleware: ${error}`);
  }
};

app.post("/applicant-login", (req, res) => {
  const { email_id, password } = req.body;
  connection.query(
    `SELECT * FROM applicant_credentials WHERE applicant_email = ?`,
    [email_id],
    async (err, results) => {
      if (err) {
        console.error("Error executing query", err);
        return res.status(500).send("Internal Server Error");
      }
      if (results.length === 0) {
        return res.status(401).send({
          msg: "Invalid credentials",
        });
      }
      const user = results[0];
      console.log(user,"user")
      console.log(password)
      let userIsMatched = await  compare(password, user.applicant_password);
      console.log(userIsMatched)
      if (userIsMatched){
        let payload = {
          email_id, password
        }
        let token = await jwt.sign(payload, TokenKey)
        console.log(token)
        return res.status(200).send({
          msg: "Login successful",
          token :token
        });
      }
    }
  );
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database: " + err.stack);
    return;
  }
  console.log("Connected to database as id " + connection.threadId);
});

app.post("/add-roleDetails", (req, res) => {
  const {
    department,
    role,
    location,
    experiences,
    Eligibility,
    skill_required,
    job_description,
    hiring_manager,
    hiring_manager_email,
    role_logo_url,
  } = req.body;
  connection.query(
    `INSERT INTO careers (department, role, location, experience, Eligibility, skill_required, job_description, hiring_manager, hiring_manager_email, role_icon_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      department,
      role,
      location,
      experiences,
      Eligibility,
      skill_required,
      job_description,
      hiring_manager,
      hiring_manager_email,
      role_logo_url,
    ],
    (err, results) => {
      if (err) {
        console.error("Error executing query", err);
        return res.status(500).send("Internal Server Error");
      }
      return res.status(200).send("Role details added successfully");
    }
  );
});

app.post("/Submit-ApplicantDetails", (req, res) => {
  const {
    role,
    role_id,
    department,
    name,
    dob,
    highest_graduation,
    graduation_year,
    cgpa,
    current_address,
    mobile_number,
    email_id,
    experience,
    reason_for_applying,
    cv_uploaded,
    applicant_login_email,
  } = req.body;
  connection.query(
    ` INSERT INTO applicants (role_id,role,department,applicant_name,mobile_number,email,years_of_experience,
        DOB,highest_graduation,graduation_year,CGPA,current_address,reason_for_applying,CV_uploaded,applicant_login_email
      )VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      role_id,
      role,
      department,
      name,
      mobile_number,
      email_id,
      experience,
      dob,
      highest_graduation,
      graduation_year,
      cgpa,
      current_address,
      reason_for_applying,
      cv_uploaded,
      applicant_login_email,
    ],
    (err, results) => {
      if (err) {
        console.error("Error executing query", err);
        return res.status(500).send("Internal Server Error");
      }
      return res.status(200).send("Applicant details added successfully");
    }
  );
});

app.get("/show-roleDetails", (req, res) => {
  connection.query(
    `SELECT * FROM careers ORDER BY role_id DESC;`,
    (err, results) => {
      if (err) {
        console.error("Error executing query", err);
        return res.status(500).send("Internal Server Error");
      }
      if (results.length === 0) {
        return res.status(404).send("No data found");
      }
      return res.status(200).json(results);
    }
  );
});

app.get("/get-JDDetails/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    `SELECT role,role_id,job_description,skill_required,department,Eligibility,experience,location FROM careers WHERE role_id = ${id}`,
    (err, results) => {
      if (err) {
        console.error("Error executing query", err);
        return res.status(500).send("Internal Server Error");
      }
      if (results.length === 0) {
        return res.status(500).send("No data found");
      }
      return res.status(200).json(results);
    }
  );
});

app.post("/add_applicant-credentials", (req, res) => {
  const { applicant_name, applicant_email, applicant_password } = req.body;

  connection.query(
    `SELECT * FROM applicant_credentials WHERE applicant_email = ?`,
    [applicant_email],
    async (err, results) => {
      if (err) {
        console.error("Error executing query", err);
        return res.status(500).send("Internal Server Error");
      }
      if (results.length > 0) {
        return res.status(400).send("Email already exists");
      }
      const hashedPassword = await hash(applicant_password, 10);
      connection.query(
        `INSERT INTO applicant_credentials (applicant_name, applicant_email, applicant_password) VALUES (?, ?, ?)`,
        [applicant_name, applicant_email, hashedPassword],
        (err, results) => {
          if (err) {
            console.error("Error executing query", err);
            return res.status(500).send("Internal Server Error");
          }
          return res.status(200).send("Applicant details added successfully");
        }
      );
    }
  );
});


app.get("/get-applicationDetails",userAuthentication,(req,res)=>{
  try {
    const {email_id} = req ;
   
    connection.query(
      `SELECT * FROM applicants where applicant_login_email="${email_id}"`, (err,results)=>{
       if(err){
        console.log(err + "get-applicationDetails");
        return res.status(500).send("Data Base Error" + "get-applicationDetails");
       }
       if(results.length===0){
        return res.status(500).send("No data found")
       }
       return res.status(200).json(results);
      }
    )
  } catch (error) {
    console.log(error + "get-applicationDetails")
  }
});


function sendEmail({recipient_email , OTP}) {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
          user: process.env.MY_EMAIL,
          pass: process.env.MY_PASSWORD,
      },
      tls: {
          ciphers: 'SSLv3',
          minVersion: 'TLSv1.2',
      }
  });
  
    const mail_configs = {
      from: process.env.MY_EMAIL,
      to: recipient_email,
      subject: "Testing PASSWORD RECOVERY",
      html: `<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8">
  <title>OTP Email</title>
  

</head>
<body>
<div style="font-family: Helvetica, Arial, sans-serif; min-width: 1000px; overflow: auto; line-height: 2;">
  <div style="margin: 50px auto; width: 70%; padding: 20px 0;">
    <div style="border-bottom: 1px solid #eee;">
      <a href="#" style="font-size: 1.4em; color: #00466a; text-decoration: none; font-weight: 600;">Cion Cancer Clinics</a>
    </div>
    <p style="font-size: 1.1em;">Hi,</p>
    <p>Thank you for choosing Cion Cancer Clinics. Use the following OTP to complete your Password Recovery Procedure. OTP is valid for 5 minutes.</p>
    <h2 style="background: #00466a; margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;">${OTP}</h2>
    <p style="font-size: 0.9em;">Regards,<br />Cion Cancer Clinics</p>
    <hr style="border: none; border-top: 1px solid #eee;" />
    <div style="float: right; padding: 8px 0; color: #aaa; font-size: 0.8em; line-height: 1; font-weight: 300;">
      <p>Cion Cancer Clinics </p>
      <p>Jubile Hills Check Post</p>
      <p>Hyderabad, Telangana</p>
    </div>
  </div>
</div>

  
</body>
</html>`,
    };
    transporter.sendMail(mail_configs,(error, info)=> {
      if (error) {
        console.log(error);
        return reject({ message: `An error has occurred` });
      }
      return resolve({ message: "Email sent successfully" });
    });
  });
}

app.post("/applicant_forgot_Password", (req, res) => {
  const { recipient_email ,OTP } = req.body;

  connection.query("SELECT * FROM applicant_credentials WHERE applicant_email = ?", [recipient_email], (err, results) => {
      if (err) {
          console.error(err);
          return res.status(500).send("Internal server error");
      }

      if (results.length === 0) {
          return res.status(404).send("Email not found"); 
      }

      sendEmail({ recipient_email, OTP })
          .then((response) => res.send(response.message))
          .catch((error) => res.status(500).send(error.message));
  });
});


app.post("/applicantSetNewPassword", userAuthentication, async (req, res) => {
  try {
    const { email_id } = req;
    const { ConfirmPassword } = req.body;
    const hashedPassword = await hash(ConfirmPassword, 10); 

    const query = `UPDATE applicant_credentials SET applicant_password = ? WHERE applicant_email = ?`;

    connection.query(query, [hashedPassword, email_id], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send({ error: "Internal server error" });
        return;
      }
      
      res.send({
        msg: "Updated Successfully",
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
});