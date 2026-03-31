import { createBrowserRouter, redirect } from 'react-router-dom';
import App from './app/app';
import Layout from './layouts/Layout';
import Conversations from './pages/Conversation/Conversations';
import Login from './pages/Auth/Login';
import Users from './pages/User/Users';
import Setting from './pages/Setting/Setting';
import ProtectedRoute from './pages/Auth/ProtectedRoute';
import { NotFound } from '@message-management/shared/ui';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <Layout />,
            children: [
              {
                index: true,
                element: <Users />,
              },
              {
                path: '/conversations/:conversationId?',
                element: <Conversations />,
              },
              {
                path: '/settings',
                element: <Setting />,
              },
            ],
          },
        ],
      },
      {
        path: '/login',
        loader: () => {
          const token = localStorage.getItem('access_token');
          // run this function before render element Login
          if (token) {
            return redirect('/');
          }
          return null;
        },
        element: <Login />,
      },
      {
        path: '*',
        element: <NotFound />
      }
    ],
  },
]);
