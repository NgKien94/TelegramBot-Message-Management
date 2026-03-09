import { Outlet } from 'react-router-dom';
import { Theme } from '@radix-ui/themes';

export function App() {
  return (
    <Theme
      style={{
        fontFamily:
          "'Montserrat', system-ui, Avenir, Helvetica, Arial, sans-serif",
      }}
    >
      {/* <TaskDashboard></TaskDashboard> */}
      <Outlet />
    </Theme>
  );
}

export default App;
