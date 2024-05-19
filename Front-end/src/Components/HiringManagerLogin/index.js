


import React, { useState } from 'react';
import "./index.css"
import { useNavigate } from 'react-router-dom';

function HiringManager() {
 const navigation = useNavigate();
  const [email , setEmail] = useState('');
  const [password ,setPassword] = useState("");
  const [error ,setError] = useState ("")

const handleHmLoginForm =(e)=>{
  e.preventDefault();
  navigation(`/hiring-Manager-DashBoard/${email}`)
}  


  return (
    
    <>
    
    <div className='hiringManger-container' >
      <h2 className='hiringManger-container__h2' >Hiring Manager Login</h2>
      <form onSubmit={handleHmLoginForm} >
        <label htmlFor="hm-email-id" className="hm-email-id"> Email-id:</label><br/>
        <input type="email" name="hm-email-id" id="hm-email-id" placeholder="Enter Your Email" required onChange={(e) => setEmail(e.target.value)} value={email} /> <br/>
  
        <label htmlFor="hm-password" className="hm-password">Password:</label><br/>
        <input type="password" name="hm-password" id="hm-password" placeholder="Enter Password" required value={password} onChange={(e) => setPassword(e.target.value)} /><br/>
        {
          error && <small className='hiringManger-container__small' style={{color:"red"}}>{error}</small>
        }<br/>
        <input className='hiringManger-container__btn' type="submit" value="Login" id="login-btn"/>
      </form>
    </div>
    </>
  )
}
export default HiringManager