import React from 'react'
import { Outlet } from "react-router-dom"
import Sidebar from '../components/owner/Sidebar'
import Header from '../components/owner/Header'

const Ownerlayouts = () => {
    return (
        <div className='flex min-h-screen bg-slate-50'>
            {/* sidebar */}
            <Sidebar />

            <div className='flex flex-1 flex-col lg:ml-72'>
                {/* header */}
                <Header />

                <main className='flex-1 p-4 md:p-6 lg:p-8'>
                    <Outlet />
                </main>
                
            </div>
        </div>
    )
}

export default Ownerlayouts