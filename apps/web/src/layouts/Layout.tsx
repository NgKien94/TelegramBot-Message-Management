import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useState } from 'react';
import { Modal } from '@message-management/shared/ui';
import { Button, Flex, TextArea } from '@radix-ui/themes';
export default function Layout() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <section className="flex min-h-screen ">
      <Sidebar onOpenBroadCastModal={() => setIsOpen(true)} />
      <div className="flex flex-col flex-1">
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <TextArea placeholder="Type here …" radius="full" className="h-4/5" />
          <Flex gap="3" className='mt-3'>
            <Button radius="medium" variant="solid" color='gray' size='2' className='flex-1' onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button radius="medium" variant="solid" size='2' className='flex-1'>
              Send
            </Button>
          </Flex>
        </Modal>
      )}
    </section>
  );
}
