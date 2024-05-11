import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./index.css";
import { baseUrl } from '../../App';
// import { Link } from 'react-router-dom';
import HTMLContent from '../code';
import { useNavigate } from 'react-router-dom';

function Careers() {
const navigation = useNavigate();

  const [careersData, setCareersData] = useState([]);


  useEffect(() => {
    axios.get(`${baseUrl}/show-roleDetails`)
      .then(response => {
        setCareersData(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleRoleClick =()=>{
    alert("if you want apply this role please login");
    navigation('/applicant-login')
  }

  return (
    <div>
      <h1 className="career-title">Careers</h1>
      <center><h2 className="Open-Positions">Open Positions</h2></center><br />
      {
  careersData.length > 0 ? (
    <div className='cards-main-container'>
      {careersData.map((career) => (
      
        <div onClick={handleRoleClick}  className="card" key={career.role_id} >
          <img className="card__image" src={`../assets/role-icon/${career.role_icon_url}`} alt="image" />
          <h3 className="card__text-h3">{career.role}</h3>
          <p className="card__location">@{career.location}</p>
          <p className="card__role-overview"><HTMLContent content={career.job_description.substring(0, 200)}/><b className="card__read-more">Read more</b></p>
        </div>
      ))}
    </div>
  ) : (
    <p style={{"textAlign":"center", marginTop:"1.25rem"}}>No More Positions</p>
  )
}

      
    </div>
  );
}

export default Careers;