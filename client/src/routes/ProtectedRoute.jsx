
import React from 'react'
import useAuth from '../hooks/useAuth'
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({children}) => {
  const {user , loading} = useAuth() ;

  if (loading) {
    return (
        <h1 className='text-center mt-20'>
            loading........
        </h1>
    )
  }

  if(!user){
    return <Navigate to='/' replace />
  }
  return children
}

export default ProtectedRoute