// import { getMe } from '@message-management/client';
// import { useQuery } from '@tanstack/react-query';
import { socket } from '@message-management/client'
import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

export default function ProtectedRoute() {
  const token = localStorage.getItem('access_token')
  useLocation() // rerender this component whenever change location

  console.log("Rerender Protected route");
  // const { isSuccess } = useQuery({
  //     queryKey: ['profile'],
  //     queryFn: () => getMe(),
  //     enabled: Boolean(token),
  //   });
  useEffect(()=> {
    socket.connect()

    return ()=> {
      socket.disconnect()
    }
  },[])

  if (!token) {
    return <Navigate to='/login' replace />
  }
  return <Outlet />
}
