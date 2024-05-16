import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./index.css";
import { AppContext, baseUrl } from "../../App";
import HTMLContent from "../code";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Footer } from "../Footer";
import { DNA } from 'react-loader-spinner'
        

function Careers() {
  const navigation = useNavigate();
  const { setRole__id } = useContext(AppContext);
  const [careersData, setCareersData] = useState([]);
  const [filterOptions, setFilterOptions] = useState([]);
  const [filterItems, setFilterItems]=useState([careersData]);


  useEffect(() => {
    axios
      .get(`${baseUrl}/show-roleDetails`)
      .then((response) => {
        setCareersData(response.data);
        setFilterItems(response.data)
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleRoleClick = (id) => {
  Cookies.set("role_id", id);
  Cookies.set('value',"secondLogin",{expires:30});
  navigation("/job-description");
  setRole__id(id);
};

  const handleLoginClick = () => {
    Cookies.set('value', 'firstLogin' , {expires:30})
    navigation("/applicant-login");
  };

  const onSelectFilter = (e) => {
    setFilterOptions(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
    console.log("Filter Options:", filterOptions); 
  };
  

  let FilterData = [...careersData];
  if (careersData.length > 0) {
    FilterData = FilterData.filter(eachData => {
      return Object.entries(filterOptions).every(([key, value]) => {
        if (key === "department" || key === "role" || key === "location") {
          return eachData[key] === value;
        }
        return true;
      });
    });
  }

  const handleSubmitSelect =(e)=>{
    e.preventDefault();
setFilterItems(FilterData);
  }
  
  return (
    <div>
        <button className="career-Login" onClick={handleLoginClick}> Login </button>
      <h1 className="career-title">Careers At CION</h1>
    
     <div className="careers__card-container">
        <div className="careers__cards">
          <img
            src="assets/benefits.jpg"
            alt=""
            className="careers__images"
          />
          <h6 className="careers__cards-h6">Benefits</h6>
          <p  className="careers__cards-p">
            Explore CION’s world-class benefits designed to help you and
            your family live well.
          </p>
        </div>
        <div className="careers__cards">
          <img
            src="assets/culture.jpg"
            alt=""
            className="careers__images"
          />
          <h6 className="careers__cards-h6">Culture</h6>
          <p  className="careers__cards-p">
          We will only achieve our mission if we live our culture, which starts with applying a growth mindset.
          </p>
        </div>
        <div className="careers__cards">
          <img
            src="assets/diversity.jpg"
            alt=""
            className="careers__images"
          />
          <h6 className="careers__cards-h6">Diversity and inclusion</h6>
          <p  className="careers__cards-p">
          We are committed to celebrating the diversity around us and its power to drive us forward together.
          </p>
        </div>
        <div className="careers__cards">
          <img
            src="assets/missionandvision.jpg"
            alt=""
            className="careers__images"
          />
          <h6 className="careers__cards-h6">Mission and Vision</h6>
          <p  className="careers__cards-p">
          At CION, we value flexibility as part of our hybrid workplace so that you can feel empowered to do your best work. 
          </p>
        </div>
      </div> <br/>

  
      <div className="careers__banner-container">
        <img className="careers__banner-img" src="assets/BannerImage.webp"/>
        <h2 className="Open-Positions">Open Positions</h2>
         <form className="careers__form-container" onSubmit={handleSubmitSelect}>
          <select  className="careers__dropDown-select" name="Department" onChange={onSelectFilter} required>
          <option value="">Select Department</option>
            <option value="Digital team">Digital Team</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Accounts/Financial">Accounts/Financial</option>
            <option value="Operations">Operations</option>
            <option value="Pharmacy">Pharmacy</option>
            <option value="Nursing">Nursing</option>
            <option value="Facilities">Facilities</option>
            <option value="Doctor">Doctor</option>
            <option value="Nutritionist">Nutritionist</option>
            <option value="Psychologist">Psychologist</option>
            <option value="Genetic counsellor">Genetic counsellor</option>
            <option value="Screening">Screening</option>
            <option value="Marketing">Marketing</option>
          </select>
          <select  className="careers__dropDown-select" name="role" onChange={onSelectFilter} required>
          <option value="">Select Role</option>
            <option>Screening Coach</option>
            <option>Clinical Pharmacist</option>
            <option>Cancer Coach</option>
            <option>Accounts Executive</option>
            <option>Nurse</option>
            <option>Marketing Executive</option>
            <option>Clinical Psychonoclogist</option>
            <option>Marketing Executive</option>

          </select>
          <select  className="careers__dropDown-select" name="location" onChange={onSelectFilter} required>
            <option value="">Select Location</option>
            <option>Vizag</option>
            <option>Hyderabad</option>
            <option>Karimnagar</option>
            <option>Siddipet</option>
          </select>
        <input type="Submit" className="careers__FindJob-btn" value="Find Job"/>
         </form>
    
  
      </div>
      <br />
      {careersData.length > 0 ? (
        <div className="cards-main-container">
          {filterItems.map((career) => (
            <div
              onClick={() => handleRoleClick(career.role_id)}
              className="card"
              key={career.role_id}
            >
              <img
                className="card__image"
                src={`../assets/role-icon/${career.role_icon_url}`}
                alt="image"
              />
              <h3 className="card__text-h3">{career.role}</h3>
              <p className="card__location">@{career.location}</p>
              <p className="card__role-overview">
                <HTMLContent
                  content={career.job_description.substring(0, 132)}
                />
                <b className="card__read-more">Read more</b>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: "center", marginTop: "1rem" ,position:"relative",bottom:"2rem"}}>
           <DNA
  visible={true}
  height="80"
  width="80"
  ariaLabel="dna-loading"
  wrapperStyle={{}}
  wrapperClass="dna-wrapper"
  />
        </p>
      )}
        <Footer/>
    </div>
    
  );
}

export default Careers;
