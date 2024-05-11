

import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Navbar } from '../Navbar'
import RoleForm from '../Roledetails'
import ApplicationDone from '../RoleDetailsSuccess'
import Careers from '../Careerspage'
import CareerDetails from '../Careerspage/jobDescription'
import { ApplicantLogin } from '../ApplicantLogin/loginPage'
import ApplicantRegisterPage from '../ApplicantLogin/registerPage'


// import { Error } from '../error'


export const Navigation = () => {
  return (
<>
<Navbar/>
  <BrowserRouter>
  <Routes>
  <Route path='/' element={<Careers/>}/>
   <Route path='/role-details' element={<RoleForm/>}/>
   <Route path='/application-created' element={<ApplicationDone/>}/>
  <Route path='/job-description/:id' element={<CareerDetails/>} />
  <Route path='/applicant-login' element={<ApplicantLogin/>} />
  <Route path='/applicant-register' element={<ApplicantRegisterPage/>} />
  </Routes>
  </BrowserRouter> 

  </>
  )
}


