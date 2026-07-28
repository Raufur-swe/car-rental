import React from 'react'
import Navber from './components/Navber'
import { Route, Router, Routes } from 'react-router-dom'
import HomePage from './pages/Home.Page'
import Mainlayouts from './layouts/Mainlayouts'
import Authlayouts from './layouts/Authlayouts'
import RegisterPage from './pages/auth/RegisterPage'
import Otppage from './pages/auth/OtpPage'
import Loginpage from './pages/auth/LoginPage'
import Ownerlayouts from './layouts/Ownerlayouts'
import OwnerDashboard from './pages/owner/OwnerDashboard'
import AllCars from './pages/owner/AllCars'
import AddCar from './pages/owner/AddCar'
import Revenue from './pages/owner/Revenue'
import Status from './pages/owner/Status'

const App = () => {
  return (
    <Routes>

      <Route element={<Mainlayouts />}  >
        <Route path='/' element={<HomePage />} />
      </Route>


      <Route element={<Authlayouts />} >

        <Route path='/register' element={<RegisterPage/>} />
        <Route path='/otp' element={<Otppage />} />
        <Route path='/login' element={<Loginpage />} />

      </Route>



      <Route path='/owner' element={<Ownerlayouts/>} >

      <Route index element={<OwnerDashboard/>} />
      <Route path='cars' element={<AllCars/>} />
      <Route path='add-car' element={<AddCar/>} />
      <Route path='revenue' element={<Revenue/>} />
      <Route path='status' element={<Status/>} />
      
      </Route>


    </Routes>
  )
}

export default App