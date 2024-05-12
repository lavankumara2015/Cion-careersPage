import React, { useState } from 'react'
import { baseUrl } from '../../App';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export const ApplicantNewPassword = () => {

const navigation = useNavigate();
    const [NewPassword ,setNewPassword ] = useState("");
    const [ConfirmPassword ,setConfirmPassword ] = useState("");
   const [error ,setError] = useState("");



   const handleConfirmBtn = (e) => {
    e.preventDefault();
    if (NewPassword === ConfirmPassword) {
        const token = Cookies.get("token");
        axios.post(`${baseUrl}/applicantSetNewPassword`, {
            ConfirmPassword
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            alert("Password Changed Successfully");
            setConfirmPassword("");
            setNewPassword("");
            navigation('/applicant-login')
        })
        .catch(error => {
            setError("Failed to change password. Please try again.");
            console.error(error);
        });
    } else {
        setError("Password Not Matched");
    }
}



  return (
    <>
    <h6>Reset Password</h6>
    <form onSubmit={handleConfirmBtn}>
    <label htmlFor="NewPassword" className="NewPassword">New Password</label><br />
                <input type="text" name="NewPassword" id="forgotPassword" placeholder="Enter New Password"
                    required
                    value={NewPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <label htmlFor="ConfirmPassword" className="ConfirmPassword">Confirm Password</label><br />
                <input type="password" name="ConfirmPassword" id="ConfirmPassword" placeholder="Enter Confirm Password"
                    required
                    value={ConfirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                { error && <h6 style={{color:"red"}}>{error}</h6>}
                <button type="submit">Submit</button>
 </form>

    </>
  )
}
