// import { StrictMode } from 'react';
// import App from './app/app';
import * as ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { httpClient } from '@message-management/utils';
import { setSocketURL } from '@message-management/client';

httpClient.setBaseURL(import.meta.env['VITE_API_BASE_URL'])
setSocketURL(import.meta.env['VITE_SOCKET_URL'])

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  // <StrictMode>
  //   <App />
  // </StrictMode>,
  <RouterProvider router={router} />
);
