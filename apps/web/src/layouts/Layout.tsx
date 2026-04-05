import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useState } from 'react';
import ModalLayout from '../components/ModalLayout';
import { AppProvider } from '../contexts/global.context';

export default function Layout() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <AppProvider>
      <section className="flex min-h-screen ">
        <Sidebar onOpenBroadCastModal={() => setIsOpen(true)} />
        <div className="flex flex-col flex-1">
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
        {isOpen && <ModalLayout isOpenModal={isOpen} setIsOpenModal={setIsOpen} />}
      </section>
    </AppProvider>
  );
}
