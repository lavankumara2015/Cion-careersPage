import React, { useCallback, useMemo, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { baseUrl } from "../../App";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "./index.css";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export const HiringManagerDashBoard = () => {
  const navigate = useNavigate();
  const { hr } = useParams();

  const containerStyle = useMemo(() => ({ width: "100%", height: "5rem" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    {
      field: "role_id",
      headerName: "Role ID",
      width: "110px",
      cellStyle: { textAlign: "center" },
    },
    { field: "role", headerName: "Role", width: "220px" },
    { field: "department", headerName: "Department", width: "160px" },
    { field: "first_name", headerName: "First Name", width: "150px" },
    { field: "last_name", headerName: "Last Name", width: "150px" },
    { field: "mobile_number", headerName: "Mobile Number", width: "180px" },
    {
      field: "years_of_experience",
      headerName: "Experience",
      width: "145px",
      cellStyle: { textAlign: "center" },
    },
    { field: "DOB", headerName: "Date of Birth", width: "170px" },
    {
      field: "highest_graduation",
      headerName: "Highest Graduation",
      width: "220px",
    },
    {
      field: "graduation_year",
      headerName: "Graduation Year",
      cellStyle: { textAlign: "center" },
    },
    {
      field: "CGPA",
      headerName: "CGPA",
      width: "100px",
      cellStyle: { textAlign: "center" },
    },
    { field: "current_address", headerName: "Current Address" },
    {
      field: "reason_for_applying",
      headerName: "Reason For Applying",
      width: "230px",
    },
    {
      field: "status",
      headerName: "Status",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: ["Applied", "Under Consideration", "Success", "Rejected"],
      },
    },
  ]);

  const handleCellEdit = useCallback(async (event) => {
    const { data, oldValue, newValue } = event;
    try {
      const options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newValue,
          role_id: data.role_id,
          field: event.colDef.field,
        }),
      };
      const updateData = await fetch(
        `${baseUrl}/update-applicationStatus`,
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
      editable: false,
      filter: true,
    };
  }, []);

  const onGridReady = useCallback((params) => {
    const token = Cookies.get("token");
    axios
      .get(`${baseUrl}/get-adminDashboard-data/${hr}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setRowData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      Cookies.remove("token");
      navigate("/hiring-managerLogin");
    }
  };

  const paginationPageSizeSelector = [5, 50, 100, 200, 500];

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
      <div className="hmDashBoard-container">
        <h5>Hiring Manager DashBoard</h5>
        <img
          src="../assets/plus_icon.webp"
          alt="plus-icon"
          className="hmDashBoard-container__img1"
          onClick={() => navigate("/role-details")}
        />
        <img
          src="../assets/Home.webp"
          alt="home_icon"
          onClick={() => {
            navigate("/");
          }}
        />
        <img
          src="../assets/careers.webp"
          alt="careers_icon"
          onClick={() => {
            navigate(`/careersList/${hr}`);
          }}
        />
      </div>

      <div style={containerStyle}>
        <div style={gridStyle} className={"ag-theme-quartz"}>
          <button
            className="hmDashBoard-containerBtn"
            style={{ cursor: "pointer" }}
            onClick={handleLogout}
          >
            Logout
          </button>

          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            onCellValueChanged={handleCellEdit}
            pagination={true}
            paginationPageSize={5}
            paginationPageSizeSelector={paginationPageSizeSelector}
          />
        </div>
      </div>

      
    </>
  );
};
