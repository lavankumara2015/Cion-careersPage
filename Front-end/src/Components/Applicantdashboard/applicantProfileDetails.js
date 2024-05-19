import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import "./index.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../App";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const ApplicantProfileDetails = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "5rem" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    { field: "first_name", headerName: "First Name" },
    { field: "last_name", headerName: "Last Name" },
    { field: "mobile_number", headerName: "Mobile Number" },
    { field: "years_of_experience", headerName: "Experience" },
    { field: "DOB", headerName: "Date of Birth" },
    { field: "highest_graduation", headerName: "Highest Graduation" },
    { field: "graduation_year", headerName: "Graduation Year" },
    { field: "CGPA", headerName: "CGPA", width: "125px" },
    { field: "current_address", headerName: "Current Address" },
  ]);

  const handleCellEdit = useCallback(async (event) => {
    const { data, oldValue, newValue } = event;
    try {
      const options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newValue,
          email: data.applicant_email,
          field: event.colDef.field,
        }),
      };
      const updateData = await fetch(
        `${baseUrl}/update-profileDetails`,
        options
      );
      toast.success("Data Updated Successfully");
    } catch (err) {
      console.log(err);
      toast.error("Data Not Updated");
    }
  });

  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      filter: true,
    };
  }, []);

  const onGridReady = useCallback((params) => {
    const token = Cookies.get("token");
    axios
      .get(`${baseUrl}/get-applicationProfileDetails`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setRowData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  const navigation = useNavigate();
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      Cookies.remove("token");
      navigation("/applicant-login");
    }
  };
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div style={containerStyle}>
        <div style={gridStyle} className={"ag-theme-quartz"}>
          <button
            className="ProfileDetailsBtn"
            style={{ cursor: "pointer" }}
            onClick={handleLogout}
          >
            Logout
          </button>
          <h5>Profile Details</h5>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            onCellValueChanged={handleCellEdit}
          />
        </div>
      </div>
    </>
  );
};

export default ApplicantProfileDetails;
