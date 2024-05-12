import './index.css';
import React, { useContext, useRef } from 'react'
import { AppContext, baseUrl } from '../../App';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export const ApplicantForm = (props) => {

  const {applicant_emailID} = useContext(AppContext)

const {careerData} = props
const navigator = useNavigate();



    const applicantForm = useRef({
        name: "",
        dob: "",
        highest_graduation: "",
        graduation_year:"",
        cgpa:"",
        current_address:"",
        mobile_number:"",
        email_id:"",
        experience:"",
        reason_for_applying:"",
        cv_uploaded:"",
    });

    const handleInputs =(e)=>{
        applicantForm.current[e.target.name]=e.target.value
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            ...applicantForm.current,
            role: careerData[0].role,
            role_id: careerData[0].role_id,
            department: careerData[0].department,
            applicant_login_email:applicant_emailID
        };
        try {
            const response = await axios.post(`${baseUrl}/Submit-ApplicantDetails`, formData);
            if (response.status === 200) {
                navigator('/applicationSuccessPage');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
  return (
    <div className="application-form">
  <h2 className="application-form__h2">Fill Your Details</h2>
  <form
    action=""
    method="post"
    encType="multipart/form-data"
    onSubmit={handleSubmit}
  >
    <label htmlFor="name" className="name">
      Name<p style={{ color: "red", display: "inline-block" }}>*</p>
    </label><br/>
    <input
      type="text"
      id="name"
      name="name"
      placeholder="Enter Name"
      minLength={3}
      required
      onChange={handleInputs}
    />
  
    <label htmlFor="dob" className="dob">
      Date of Birth<p style={{ color: "red", display: "inline-block" }}>*</p>
    </label><br/>
    <input
      type="date"
      id="dob"
      name="dob"
      placeholder="Enter DOB"
      required
      onChange={handleInputs}

    />
    <label htmlFor="highest_graduation" className="highest_graduation">
      Highest Graduation
      <p style={{ color: "red", display: "inline-block" }}>*</p>
    </label>
    <input
      type="text"
      id="highest_graduation"
      placeholder="Enter Highest Graduation"
      name="highest_graduation"
      required
      onChange={handleInputs}

    />
    <br />
    <label htmlFor="graduation_year" className="graduation_year">
      Graduation Year<p style={{ color: "red", display: "inline-block" }}>*</p>
    </label>
    <input
      type="number"
      id="graduation_year"
      placeholder="Enter Graduation-Year"
      maxLength={4}
      name="graduation_year"
      required
      onChange={handleInputs}

    />
 
    <label htmlFor="cgpa" className="cgpa">
      CGPA/Percentage<p style={{ color: "red", display: "inline-block" }}>*</p>
    </label><br/>
    <input
      type="number"
      id="cgpa"
      name="cgpa"
      placeholder="Enter CGPA/Percentage"
      step="any"
      maxLength={3}
      required
      onChange={handleInputs}

    />{" "}
    <label htmlFor="current_address" className="current_address">
      Current Address<p style={{ color: "red", display: "inline-block" }}>*</p>
    </label>
    <input
      type="text"
      id="current_address"
      placeholder="Enter Current-Address"
      name="current_address"
      required
      onChange={handleInputs}

    />
    <br />
    <label htmlFor="mobile_number" className="mobile_number ">
      Mobile Number<p style={{ color: "red", display: "inline-block" }}>*</p>
    </label><br/>
    <input
      type="tel"
      id="mobile_number"
      name="mobile_number"
      placeholder="Enter Mobile-Number"
      minLength={10}
      maxLength={10}
      required
      onChange={handleInputs}

    />

<label htmlFor="mobile_number" className="mobile_number email">
      Email<p style={{ color: "red", display: "inline-block" }}>*</p>
    </label><br/>
    <input
      type="email"
      id="email_id"
      name="email_id"
      placeholder="Enter Email_ID"
      required
      onChange={handleInputs}

    />
    <label htmlFor="experience" className="mobile_number experience">
      Experience<p style={{ color: "red", display: "inline-block" }}>*</p>
    </label>
    <input
      type="tel"
      id="experience"
      name="experience"
      placeholder="Enter Experience"
      maxLength={2}
      required
      onChange={handleInputs}
      style={{ marginLeft: "0.83rem" }}
    />
    <br />
    <label htmlFor="reason_for_applying" className="reason_for_applying">
      Reason for Applying{" "}
      <p style={{ color: "red", display: "inline-block" }}>*</p>
    </label>
    <br />
    <textarea
      style={{ resize: "none" }}
      id="reason_for_applying"
      name="reason_for_applying"
      placeholder="Enter Reason-For-Applying"
      required
      onChange={handleInputs}
      defaultValue={""}
    />
    <br />
    <label htmlFor="cv_uploaded" className="cv_uploaded">
      Upload CV<p style={{ color: "red", display: "inline-block" }}>*</p>
    </label>
    <input
      type="file"
      id="cv_uploaded"
      name="cv_uploaded"
      accept=".pdf, .doc, .docx"
      required
      onChange={handleInputs}
    />
    <br />
    <center>
      <input type="submit" className="form-btn" defaultValue="Submit" />
    </center>
  </form>
</div>

  )
}
