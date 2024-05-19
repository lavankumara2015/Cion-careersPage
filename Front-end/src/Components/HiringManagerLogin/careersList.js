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

export const CareersList = () => {
  const navigate = useNavigate();
  const { email } = useParams();

  const containerStyle = useMemo(() => ({ width: "100%", height: "5rem" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    { field: "role_id", headerName: "Role ID", width: "109px" },
    { field: "role", headerName: "Role" },
    { field: "department", headerName: "Department" },
    { field: "location", headerName: "Location", width: "124px" },
    { field: "experience", headerName: "Experience", width: "150px" },
    { field: "Eligibility", headerName: "Eligibility", width: "280px" },
    { field: "hiring_manager", headerName: "Hiring Manager" },
    {
      field: "hiring_manager_email",
      headerName: "Highest Manager Email",
      width: "250px",
    },
    {
      field: "status",
      headerName: "Status",
      width: "120px",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: ["Open", "Close"],
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
        `${baseUrl}/update-careersStatus`,
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
    axios
      .get(`${baseUrl}/get-careers_data-table/${email}`)
      .then((response) => {
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
      <div className="career-main-container">
        <h5>Careers list</h5>
      </div>

      <div className="careers-main-container__agGrid">
        <div style={containerStyle}>
          <div style={gridStyle} className={"ag-theme-quartz"}>
            <button
              className="CareerListBtn"
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
      </div>
    </>
  );
};
