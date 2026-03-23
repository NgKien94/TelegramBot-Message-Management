import { socket } from '@message-management/client'
import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

export default function ProtectedRoute() {
  const [token, setToken] = useState(() => localStorage.getItem('access_token'));
  useLocation() // rerender this component whenever change location

  useEffect(()=> {
    socket.connect()

    return ()=> {
      socket.disconnect()
    }
  },[])

  useEffect(()=>{
    const handleOnChangeToken = (e: CustomEvent) => {
      console.log("Change token");
      setToken(e.detail)
      socket.connect()
    }

    window.addEventListener('token_refreshed', handleOnChangeToken as EventListener)

    return ()=> {
      window.removeEventListener('token_refreshed', handleOnChangeToken as EventListener)
    }
  },[])


  if (!token) {
    return <Navigate to='/login' replace />
  }
  return <Outlet />
}
