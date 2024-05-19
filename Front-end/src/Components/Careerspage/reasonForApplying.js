import React, { useContext, useState } from 'react'
import "./index.css";
import { AppContext } from '../../App';
import { baseUrl} from '../../App';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';


export const ReasonForApplying = () => {
  const {jdData} = useContext(AppContext);
  const navigation = useNavigate();
  const {applicantPassword,applicantRegisterDetails,applicant_emailID} = useContext(AppContext) 
  const [cv_uploaded ,setCV_uploaded]=useState('');
  const [reason, setReason] = useState('');
  const [err ,setErr] = useState('');



  
  const handleSubmitForm = async (e) => {
    e.preventDefault();
  
    const firstLogin = Cookies.get('value');
  
    const obj = {
      email: applicant_emailID,
      Password: applicantPassword,
      reasonForApplying: reason,
      cv_uploaded: cv_uploaded,
      applicantRegisterDetails: JSON.stringify(applicantRegisterDetails)
    };
  
    try {
      const response = await fetch(`${baseUrl}/Submit-details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
      });
      const data = await response.json();
  
      if (data.token) {
        Cookies.set('token', data.token, { expires: 30 });
        navigation('/applicationSuccessPage');
      } else {
        setErr(data.message || "Failed to submit details");
      }
    } catch (error) {
      console.error(error);
      setErr(error.message || "An error occurred");
    }
    if (firstLogin !== 'firstLogin') {
      try {
        const { role, role_id, department } = jdData[0] || {};
  
        if (!role || !role_id || !department) {
          setErr("Job details are missing. Please check your input.");
          return;
        }
  
        const additionalDetailsResponse = await fetch(`${baseUrl}/get-additional-details`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: applicant_emailID })
        });
        const additionalDetails = await additionalDetailsResponse.json();
  
        if (!additionalDetails) {
          setErr("Failed to fetch additional details");
          return;
        }
        const object = {
          email: applicant_emailID,
          Password: applicantPassword,
          reasonForApplying: reason,
          cv_uploaded: cv_uploaded,
          applicantRegisterDetails:{
            role,
            role_id,
            department,
            firstname: additionalDetails.first_name,
            lastname: additionalDetails.last_name,
            mobile_number: additionalDetails.mobile_number,
            experience: additionalDetails.years_of_experience,
            dob: additionalDetails.DOB,
            cgpa: additionalDetails.CGPA,
            highest_graduation: additionalDetails.highest_graduation,
            graduation_year: additionalDetails.graduation_year,
            current_address: additionalDetails.current_address,
          }
        };
        const response = await fetch(`${baseUrl}/Submit-details`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(object)
        });
        const data = await response.json();
  
        if (data.token) {
          Cookies.set('token', data.token, { expires: 30 });
          navigation('/applicationSuccessPage');
        } else {
          setErr(data.message || "Failed to submit details");
        }
      } catch (error) {
        console.error(error);
        setErr(error.message || "An error occurred");
      }
    }
  };
  
  return (
    <div className='reasonForApplying-container'>

  <h5 >Fill The Form</h5>
  <form onSubmit={handleSubmitForm}>
  <label htmlFor='reasonForApplying' className='reasonForApplying' >Reason For Applying <p style={{ color: "red", display: "inline-block" }}>*</p></label>
  <br/>
  <textarea
  id='reasonForApplying'
  name='reasonForApplying'
  placeholder='Enter Reason For Applying'
  value={reason}
  required
  onChange={(e)=>setReason(e.target.value)}
  /> <br/>
  <label htmlFor='resumeUpload' className='resumeUpload' >Updated CV <p style={{ color: "red", display: "inline-block" }}>*</p></label>
  <br/>
  <input 
  type="file"
  id="resumeUpload"
  name="resumeUpload"
  accept=".pdf, .doc, .docx"
  required
  value={cv_uploaded}
  onChange={(e)=>setCV_uploaded(e.target.value)}
  /><br/>
  <p style={{color:"red" , fontSize:"0.4rem"}}>{err}</p>
  <input type='submit' className='reasonForApplying-btn' defaultValue="Submit"/>
    </form>
    </div>
  )
}

