import { createBrowserRouter, redirect } from 'react-router-dom';
import App from './app/app';
import Layout from './layouts/Layout';
import Conversations from './pages/Conversation/Conversations';
import ConversationDetail from './pages/Conversation/ConversationDetail';
import Login from './pages/Auth/Login';
import Users from './pages/User/Users';
import Setting from './pages/Setting/Setting';
import ProtectedRoute from './pages/Auth/ProtectedRoute';

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
                path: '/conversations',
                element: <Conversations />,
              },
              {
                path: '/conversations/:id',
                element: <ConversationDetail />,
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
    ],
  },
]);
