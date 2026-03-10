import { Theme } from '@radix-ui/themes';
import { Outlet } from 'react-router-dom';



export function App() {
  return (
    <Theme
      style={{
        fontFamily:
          "'Montserrat', system-ui, Avenir, Helvetica, Arial, sans-serif",
      }}
    >
      <Outlet />
    </Theme>
  );
}

export default App;
