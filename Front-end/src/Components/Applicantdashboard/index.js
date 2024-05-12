import React, { useContext, useEffect, useState } from "react";
import "./index.css";
import axios from "axios";
import { AppContext, baseUrl } from "../../App";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export const ApplicantDashBoard = () => {

    
    const navigation = useNavigate();
    const [applicationDetails, setApplicationDetails] = useState([]);
    const [filteredApplicationDetails, setFilteredApplicationDetails] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null); 

    useEffect(() => {
      const token = Cookies.get("token")
        axios.get(`${baseUrl}/get-applicationDetails`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((response) => {
            setApplicationDetails(response.data);
            setIsLoading(false);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            setError(error);
            setIsLoading(false);
        });
    }, []);
    
    useEffect(() => {
        const filteredDetails = applicationDetails.filter(detail =>
            Object.values(detail).some(value =>
                value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredApplicationDetails(filteredDetails);
    }, [searchTerm, applicationDetails]);

    if (isLoading) {
        return <p>Loading...</p>;
    }
    if (error) {
        return <p>Error: {error.message}</p>;
    }

    const handleLogout =()=>{
        Cookies.remove("token");
        navigation('/applicant-login')
        
    }

    return (
        <>
            <div className="dashBoard">
                <h5>Application Dashboard</h5>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button style={{cursor:"pointer"}} onClick={handleLogout}>Logout</button>
            </div>
            <p>Hello : <span style={{color:"black"}}>{applicationDetails[0].applicant_login_email} </span></p>
            <table>
                <thead>
                    <tr>
                        <th>Role ID</th>
                        <th>Role</th>
                        <th>Name</th>
                        <th>Mobile No</th>
                        <th>Email</th>
                        <th>Highest Graduation</th>
                        <th>CGPA</th>
                        <th>Current Address</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredApplicationDetails.map((value, ind) => (
                        <tr key={ind}>
                            <td>{value.role_id}</td>
                            <td>{value.role}</td>
                            <td>{value.applicant_name}</td>
                            <td>{value.mobile_number}</td>
                            <td>{value.email}</td>
                            <td>{value.highest_graduation}</td>
                            <td>{value.CGPA}</td>
                            <td>{value.current_address}</td>
                            <td>{value.Status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};
