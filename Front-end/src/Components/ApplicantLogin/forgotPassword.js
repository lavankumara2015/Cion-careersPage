import React, { useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../../App';
import { InputOtp } from 'primereact/inputotp';
import "./index.css"
import { useNavigate } from 'react-router-dom';

export const ApplicantForgotPassword = () => {
    const navigation = useNavigate();
    const [forgotEmail, setForgotEmail] = useState('');
    const [OTP, setOTP] = useState('');
    const [page, setPage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [enteredOTP, setEnteredOTP] = useState('');
    const [showOTPInput, setShowOTPInput] = useState(false);
    const [validOTP ,setValidOTP] = useState("")

    const load = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    function handleSubmit(e) {
        e.preventDefault();
        navigateToOtp();
    }

    function navigateToOtp() {
        if (!forgotEmail) {
            setError('Please enter your email');
            return;
        }

        const newOTP = Math.floor(Math.random() * 9000 + 1000);
        setOTP(newOTP);

        axios.post(`${baseUrl}/applicant_forgot_Password`, {
            OTP: newOTP,
            recipient_email: forgotEmail,
        })
        .then(() => {        
            setPage('otp');
            setShowOTPInput(true); 
            alert("OTP Sent Successfully");
        })
        .catch(err => {
            setError('Invalid Email Please Register');
            console.error(err);
        });
    }

    function handleOTPSubmit() {
        if (enteredOTP === OTP.toString()) {
            navigation("/applicantSetNewPassword")
        } else {
            setValidOTP('Invalid OTP. Please try again.');
        }
    }
    const handleResendBtn=()=>{
        navigateToOtp();
    }

    return (
        <>
            <h5>Forgot Password</h5>
            <form onSubmit={handleSubmit}>
                <label htmlFor="forgotPassword" className="forgotPassword">Email:</label><br />
                <input
                    type="email"
                    name="forgotPassword-email"
                    id="forgotPassword"
                    placeholder="Enter Email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                /><br/>
                <button type="submit" loading={loading} onClick={load} >Send OTP</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {page === 'otp' && showOTPInput && (
                <div className="otpPopup">
                    <InputOtp value={enteredOTP} onChange={(e) => setEnteredOTP(e.value)} integerOnly mask/>
                {  validOTP&& <h6 style={{ color: 'red' }}>{validOTP}</h6> }
                    <button onClick={handleOTPSubmit}>Submit OTP</button>
                    <button onClick={handleResendBtn}>Resend OTP</button>
                </div>
            )}
        </>
    );
};
