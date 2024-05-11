import React, { useState } from 'react';
import { baseUrl } from '../../App';
import axios from 'axios';
import { Link, useNavigate, useNavigation } from 'react-router-dom';

const ApplicantRegisterPage = () => {
    const navigation = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true); 

  const handleSubmit =  async(e) => {
    e.preventDefault();


    const userDetails={
        applicant_name:name,
        applicant_email:email,
        applicant_password:password,
    }
    if (password === confirmPassword) {
       setPasswordsMatch(true); 
       try {
        const response = await axios.post(`${baseUrl}/add_applicant-credentials`,userDetails)
         if(response.status === 200){
            alert("Register Successfully");
            navigation("/applicant-login");
         }
       } catch (error) {
        console.error('error',error)
       }
    } else {
      console.log("Passwords do not match!");
      setPasswordsMatch(false);
    }
  };

  return (
    <>
      <h5>Applicant Register Page</h5>
      <form onSubmit={handleSubmit}>
        <label htmlFor="applicant_name" className="applicant_name">Name:</label>
        <input type="text" name="applicant_name" id="applicant_name" placeholder="Enter Your Name" required value={name} onChange={(e) => setName(e.target.value)} /><br />

        <label htmlFor="applicant_email" className="applicant_email"> Email-id :</label>
        <input type="email" name="applicant_email" id="applicant_email" placeholder="Enter Your Email" required value={email} onChange={(e) => setEmail(e.target.value)} /><br />

        <label htmlFor="applicant_password" className="applicant_password">Password</label>
        <input type="password" name="applicant_password" id="applicant_password" placeholder="Enter Your Password" required value={password} onChange={(e) => setPassword(e.target.value)} /><br />

        <label htmlFor="confirm_password" className="confirm_password"> Confirm Password:</label>
        <input type="password" name="confirm_password" id="confirm_password" placeholder="Confirm Your Password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /><br />

        {!passwordsMatch && confirmPassword && <p style={{ color: 'red' }}>Passwords do not match!</p>} 
        <input type='submit' name='submit' />

        <h5>you have already account then <Link to={"/applicant-login"}>click here</Link></h5>
      </form>
    </>
  );
};

export default ApplicantRegisterPage;
