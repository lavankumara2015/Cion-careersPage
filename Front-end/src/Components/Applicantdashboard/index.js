import React, { useEffect, useState } from "react";
import "./index.css";
import axios from "axios";
import { baseUrl } from "../../App";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { DNA } from "react-loader-spinner";
import { Footer } from "../Footer";

export const ApplicantDashBoard = () => {
  const navigation = useNavigate();
  const [applicationDetails, setApplicationDetails] = useState([]);
  const [filteredApplicationDetails, setFilteredApplicationDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token");
    axios
      .get(`${baseUrl}/get-applicationDetails`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setApplicationDetails(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const filteredDetails = applicationDetails.filter((detail) =>
      Object.values(detail).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredApplicationDetails(filteredDetails);
  }, [searchTerm, applicationDetails]);

  if (isLoading) {
    return (
      <div className="spinner">
        <DNA
          visible={true}
          height="80"
          width="80"
          ariaLabel="dna-loading"
          wrapperStyle={{}}
          wrapperClass="dna-wrapper"
        />
      </div>
    );
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      Cookies.remove("token");
      navigation("/applicant-login");
    }
  };

  const handleProfile = () => {
    navigation("/applicant-profileDetails");
  };

  const getDotColor = (status) => {
    switch (status) {
      case "Applied":
        return "blue";
      case "Under Consideration":
        return "yellow";
      case "Success":
        return "green";
      case "Rejected":
        return "red";
      default:
        return "blue";
    }
  };

  return (
    <>
      <div className="dashBoard-container">
        <button
          className="dashBoard-container__btn"
          style={{ cursor: "pointer" }}
          onClick={handleLogout}
        >
          Logout
        </button>
        {applicationDetails.length > 0 && (
          <div className="dashBoard-container__profileIcon">
            <p onClick={handleProfile}>
              {applicationDetails[0].first_name[0].toUpperCase()}
              {applicationDetails[0].last_name[0].toUpperCase()}
            </p>
          </div>
        )}
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          className="dashBoard-container__input"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="material-symbols-outlined">search</span>
      </div>
      <div className="dashBoard">
        <h5>Your Applications</h5>
      </div>
      <div className="cards-container">
        {filteredApplicationDetails.map((value, ind) => (
          <div className="cards" key={ind}>
            <div className="card-content">
              <h4>Application Status</h4>
              <p>
                <strong>Department:</strong> {value.department}
              </p>
              <p>
                <strong>Role:</strong> {value.role}
              </p>
              <p>
                <strong>Role ID:</strong> {value.role_id}
              </p>
              <p>
                <strong>Email:</strong> {value.applicant_email}
              </p>
              <p>
                <strong>Status:</strong> 
                <span 
                  className="dot" 
                  style={{ backgroundColor: getDotColor(value.status) }}
                ></span>
                {value.status}
              </p>
            </div>
          </div>
        ))}
      </div>
      <Footer/>
    </>
  );
};
