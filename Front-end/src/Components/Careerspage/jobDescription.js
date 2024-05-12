import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../App";
import HTMLContent from "../code";
import { ApplicantForm } from "../ApplicationSubmitForm";
import Cookies from "js-cookie";

function CareerDetails() {
  const [careerData, setCareerData] = useState([]);

  useEffect(() => {
    const roleId = Cookies.get("role_id")
    if(roleId !== undefined){
      const fetchCareerDetails = async () => {
        try {
          const response = await axios.get(`${baseUrl}/get-JDDetails/${roleId}`);
          setCareerData(response.data);
          console.log(response.data, "getting data");
        } catch (error) {
          console.error("Error fetching career details:", error);
        }
      };
      fetchCareerDetails();
    }

  }, []);

  const handleApplyNow = () => {
     const myDialogs = document.getElementById("myDialogs");
     myDialogs.showModal();
     window.onclick = function(event) {
        if (event.target == myDialogs) {
            myDialogs.close();
        }
      }
  };

    const handleClose =()=>{
        var myDialogs = document.getElementById("myDialogs");
        myDialogs.close();
    }


  return (
    <>
    {(
    <dialog  id="myDialogs">
        <img src="../assets/Cancel.webp" alt="cancel-btn" id="cancel-btn" onClick={handleClose} />
     <div className="myDialog-containers">
        <ApplicantForm careerData={careerData} />
     </div>
    </dialog>
    )}
      {careerData.map((value, index) => (
        <div key={index}>
          <h1 className="role-text-h1">{value.role}</h1>
          <div className="vaccine-container">
            <div className="vaccine-container__role">
              <h2>Role</h2>
              <p>{value.role}</p>
            </div>
            <div className="vaccine-container__job-id">
              <h2>Role-id</h2>
              <p>{value.role_id}</p>
            </div>
            <div className="vaccine-container__job-description">
              <h2>Job Description</h2>
              <p>
                <HTMLContent content={value.job_description} />
              </p>
            </div>
            <div className="vaccine-container__skill-required">
              <h2>Skill-Required</h2>
              <p>
                <HTMLContent content={value.skill_required} />
              </p>
            </div>
            <div className="vaccine-container__department">
           <h2>Department</h2>
           <p>{value.department}</p>
            </div>
            <div className="vaccine-container__location">
              <h2>Eligibility</h2>
              <p>{value.Eligibility}</p>
            </div>
            <div className="vaccine-container__experience">
              <h2>Experience</h2>
              <p>{value.experience}</p>
            </div>
            <div className="vaccine-container__qualification">
              <h2>Location</h2>
              <p>{value.location}</p>
            </div>
           
          </div>
          <center>
            <button onClick={handleApplyNow} className="vaccine-container__btn">
              Apply Now
            </button>
          </center>
        </div>
      ))}

    </>
  );
}

export default CareerDetails;
