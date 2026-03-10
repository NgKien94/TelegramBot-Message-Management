// import { getMe } from '@message-management/client';
// import { useQuery } from '@tanstack/react-query';
import { Navigate, Outlet } from 'react-router-dom'

export default function ProtectedRoute() {
  const token = localStorage.getItem('access_token')

  // const { isSuccess } = useQuery({
  //     queryKey: ['profile'],
  //     queryFn: () => getMe(),
  //     enabled: Boolean(token),
  //   });

  if (!token) {
    return <Navigate to='/login' replace />
  }
  return <Outlet />
}