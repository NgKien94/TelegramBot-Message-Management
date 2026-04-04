import { Theme } from '@radix-ui/themes';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// const queryClient = new QueryClient();

export function App() {
  return (
      <Theme
        style={{
          fontFamily:
            "'Montserrat', system-ui, Avenir, Helvetica, Arial, sans-serif",
        }}
      >
        <Outlet />
        <ToastContainer
        toastClassName="!justify-start"
  />
      </Theme>
  );
}

export default App;
