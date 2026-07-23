import React from 'react'
import Navber from './components/Navber'
import { Route, Router, Routes } from 'react-router-dom'
import HomePage from './pages/Home.Page'

const App = () => {
  return (
   <>
  <Navber/>
  <Routes>
    <Route path='/'  element={<HomePage/>}/>
  </Routes>
   </>
  )
}

export default App