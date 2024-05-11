import React, { useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../../App';

export const ApplicantLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]=useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${baseUrl}/applicant-login`, {
        email_id: email,
        password: password
      });

      if (response.status === 200) {
        alert("Login Successful");
      } else {
        console.log(response.data)
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error?.response?.data?.msg || "")
    }
  }

  return (
    <>
      <h6>Applicant Login</h6>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="applicant-email-id" className="applicant-email-id"> Email-id :</label><br/>
        <input type="email" name="applicant-email-id" id="applicant-email-id" placeholder="Enter Your Email" required onChange={(e) => setEmail(e.target.value)} value={email} /> <br/>
  
        <label htmlFor="applicant-password" className="applicant-password">Password :</label><br/>
        <input type="password" name="applicant-password" id="applicant-password" placeholder="Enter Password" required value={password} onChange={(e) => setPassword(e.target.value)} /><br/>
 
        {
          error && <small style={{color:"red"}}>{error}</small>
        }<br/>
        <input type="submit" value="Login" id="login-btn"/>
      </form>
    </>
  );
}
