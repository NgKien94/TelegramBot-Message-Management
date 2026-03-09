import { createBrowserRouter } from "react-router-dom";
import App from "./app/app";
import Layout from "./layouts/Layout";
import Conversations from "./pages/Conversation/Conversations";
import ConversationDetail from "./pages/Conversation/ConversationDetail";
import Login from "./pages/Auth/Login";
import Users from "./pages/User/Users";
import Setting from "./pages/Setting/Setting";

export const router = createBrowserRouter([
    {
      path: '/',
      element: <App />,
      children: [
        {
          element: <Layout />,
          children: [
              {
                index: true,
                element: <Users />
              },
              {
                path: '/conversations',
                element: <Conversations />
              },
              {
                path: '/conversations/:id',
                element: <ConversationDetail />
              },
              {
                path: '/settings',
                element: <Setting />
              }
          ]
        },
        {
          path: '/login',
          element: <Login />
        }
      ]
    }
])
