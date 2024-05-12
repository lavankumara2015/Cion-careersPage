import React, { createContext, useContext, useState } from 'react';
import './App.css';
import { Navigation } from './Components/Navigation/navigation';
import { PrimeReactProvider } from 'primereact/api';

export const baseUrl = "http://localhost:3004"


 export const AppContext = createContext();

function App() {
  const [role__id, setRole__id] = useState("");
  const [applicant_emailID, setApplicant_emailID]=useState("");

  return (
    <PrimeReactProvider>
    <AppContext.Provider value={{ role__id, setRole__id,applicant_emailID,setApplicant_emailID }}>
      <div>
        <Navigation/>
      </div>
    </AppContext.Provider>
    </PrimeReactProvider>

  );
}

export default App;
