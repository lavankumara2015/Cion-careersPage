import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AppContext, baseUrl } from '../../App';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './index.css'

export const ApplicantLogin = () => {
  const {setApplicant_emailID} = useContext(AppContext);
  const navigation = useNavigate();
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
        Cookies.set( 'token',response.data.token, {expires : 30})
        navigation(`/job-description`)
        setApplicant_emailID(email);

      } else {
        console.log(response.data)
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error?.response?.data?.msg || "")
    }
  }

  return (
    <div className='applicant-container' >
      <h2 className='applicant-container__h2' >Applicant Login</h2>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="applicant-email-id" className="applicant-email-id"> Email-id:</label><br/>
        <input type="email" name="applicant-email-id" id="applicant-email-id" placeholder="Enter Your Email" required onChange={(e) => setEmail(e.target.value)} value={email} /> <br/>
  
        <label htmlFor="applicant-password" className="applicant-password">Password:</label><br/>
        <input type="password" name="applicant-password" id="applicant-password" placeholder="Enter Password" required value={password} onChange={(e) => setPassword(e.target.value)} /><br/>
        {
          error && <small className='applicant-container__small' style={{color:"red"}}>{error}</small>
        }<br/>
        <Link className='applicant-container__Link' to={"/applicant-forgotPassword"}>ForgotPassword</Link><br/>
        <input className='applicant-container__submit' type="submit" value="Login" id="login-btn"/>
        <h5 className='applicant-container__h5'>Don't have account <Link className='applicant-container__Link2' to={'/applicant-register'}>Register here</Link></h5>
      </form>
    </div>
  );
}
