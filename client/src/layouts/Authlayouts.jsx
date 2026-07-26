import React from 'react'
import { Outlet } from 'react-router-dom'

const Authlayouts = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <Outlet/>
    </div>
  )
}

export default Authlayouts