import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
export default function Layout() {
  return (
    <section className='flex min-h-screen'>
      <Sidebar />
      <div className='flex flex-col flex-1'>
        <main className='flex-1 overflow-auto'>
          <Outlet />
        </main>
      </div>
    </section>
  )
}
