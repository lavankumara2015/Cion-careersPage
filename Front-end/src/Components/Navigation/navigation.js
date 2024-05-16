import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Navbar } from '../Navbar'
import RoleForm from '../Roledetails'
import ApplicationDone from '../RoleDetailsSuccess'
import Careers from '../Careerspage'
import CareerDetails from '../Careerspage/jobDescription'
import { ApplicantLogin } from '../ApplicantLogin/loginPage'
import ApplicantRegisterPage from '../ApplicantLogin/registerPage'
import { ApplicantDashBoard } from '../Applicantdashboard'
import { ApplicationSuccessPage } from '../ApplicationSuccess'
import { ApplicantForgotPassword } from '../ApplicantLogin/forgotPassword'
import { ApplicantNewPassword } from '../ApplicantLogin/setNewPassword'
import { ApplicantForm } from '../ApplicaticantRegisterForm'
import { ReasonForApplying } from '../Careerspage/reasonForApplying'


export const Navigation = () => {
  return (
<>
<Navbar/>
  <BrowserRouter>
  <Routes>
  <Route path='/' element={<Careers/>}/>
   <Route path='/role-details' element={<RoleForm/>}/>
   <Route path='/application-created' element={<ApplicationDone/>}/>
  <Route path='/job-description' element={<CareerDetails/>} />
  <Route path='/applicant-login' element={<ApplicantLogin/>} />
  <Route path='/applicant-register' element={<ApplicantRegisterPage/>} />
  <Route path='/applicant-dashboard' element={<ApplicantDashBoard/>} />
  <Route path='/applicationSuccessPage' element={<ApplicationSuccessPage/>} />
  <Route path='/applicant-forgotPassword' element={<ApplicantForgotPassword/>} />
  <Route path='/applicantSetNewPassword' element={<ApplicantNewPassword/>} />
  <Route path='/applicant-registerForm' element={<ApplicantForm/>} />
  <Route path='/reasonForApplying' element={<ReasonForApplying/>} />
  </Routes>
  </BrowserRouter> 


  </>
  )
}


