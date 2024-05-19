import React, { useContext, useState } from "react";
import axios from "axios";
import { AppContext, baseUrl } from "../../App";
import { InputOtp } from "primereact/inputotp";
import "./index.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export const ApplicantForgotPassword = () => {
  const { setApplicant_emailID } = useContext(AppContext);
  const navigation = useNavigate();
  const [forgotEmail, setForgotEmail] = useState("");
  const [OTP, setOTP] = useState("");
  const [page, setPage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [enteredOTP, setEnteredOTP] = useState("");
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [validOTP, setValidOTP] = useState("");



  const load = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const firstLogin =Cookies.get('value');


  function handleSubmit(e) {
    e.preventDefault();
    navigateToOtp();
  }

  async function navigateToOtp() {
    const firstLogin = Cookies.get('value');
    const newOTP = Math.floor(Math.random() * 9000 + 1000);
    setOTP(newOTP);
  
    if (firstLogin !== "firstLogin") {
      if (!forgotEmail) {
        setError("Please enter your email");
        return;
      }
      await axios.post(`${baseUrl}/applicant_verifyEmail`, {
        OTP: newOTP,
        recipient_email: forgotEmail,
      }).then(() => {
        alert("OTP Sent Successfully");
        setPage("otp");
        setShowOTPInput(true);
        setApplicant_emailID(forgotEmail);
        console.log("clk")
      }).catch((err) => {
        setError("Invalid Email Please Register");
        console.error(err);
      });
    } else {
      if (!forgotEmail) {
        setError("Please enter your email");
        return;
      }
      await axios.post(`${baseUrl}/applicant_forgot_Password`, {
        OTP: newOTP,
        recipient_email: forgotEmail,
      }).then(() => {
        setPage("otp");
        setShowOTPInput(true);
        setApplicant_emailID(forgotEmail);
        alert("OTP Sent Successfully");
      }).catch((err) => {
        setError("Invalid Email Please Register");
        console.error(err);
      });
    }
  }
  
  function handleOTPSubmit() {
    if (enteredOTP === OTP.toString()) {
      navigation("/applicantSetNewPassword");
    } else {
      setValidOTP("Invalid OTP. Please try again.");
    }
  }
  const handleResendBtn = () => {
    navigateToOtp();
  };

  return (
    <div className="forgotPassword-container">
      <h5 className="forgotPassword-container__h5">{firstLogin === 'firstLogin' ? "Forgot Password" : "Verify Your Email"}</h5>
      <form onSubmit={handleSubmit}>
        <label htmlFor="forgotPassword" className="forgotPassword">
          Email:
        </label>
        <br />
        <input
          type="email"
          name="forgotPassword-email"
          id="forgotPassword"
          placeholder="Enter Email"
          required
          value={forgotEmail}
          onChange={(e) => setForgotEmail(e.target.value)}
        />
        <br />
        {error && (
          <small
            className="forgotPassword-container__small"
            style={{ color: "red" }}
          >
            {error}
          </small>
        )}
        <br />

        <button
          className="forgotPassword-container__submit"
          type="submit"
          loading={loading}
          onClick={load}
        >
          Send OTP
        </button>
      </form>
      {page === "otp" && showOTPInput && (
        <div className="otpPopup">
        <h6 className="otpPopup__h6">Enter OTP</h6>
          <InputOtp
            value={enteredOTP}
            onChange={(e) => setEnteredOTP(e.value)}
            integerOnly
            mask
          />
          {validOTP && (

            <h6
              className="forgotPassword-container__validOTP"
              style={{ color: "red" }}
            >
              {validOTP}
            </h6>
          )}
          <button
            className="forgotPassword-container__submitOTP"
            onClick={handleOTPSubmit}
          >
            Submit OTP
          </button>
          <button
            className="forgotPassword-container__resendOTP"
            onClick={handleResendBtn}
          >
            Resend OTP
          </button>
        </div>
      )}
    </div>
  );
};
