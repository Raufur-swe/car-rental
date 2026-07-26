import React from 'react'
import Navber from './components/Navber'
import { Route, Router, Routes } from 'react-router-dom'
import HomePage from './pages/Home.Page'
import Mainlayouts from './layouts/Mainlayouts'
import Authlayouts from './layouts/Authlayouts'
import RegisterPage from './pages/auth/RegisterPage'
import Otppage from './pages/auth/OtpPage'
import Loginpage from './pages/auth/LoginPage'

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


    </Routes>
  )
}

export default App