import { GetConversationRequest } from '@message-management/types';
import clsx from 'clsx';
import { Dispatch, SetStateAction, useState } from 'react';

interface ConversationFilterProps extends React.HTMLAttributes<HTMLDivElement> {
  onApplyFilter: Dispatch<SetStateAction<GetConversationRequest>>;
}

export default function ConversationFilter({ onApplyFilter }: ConversationFilterProps) {
  const [isActive, setIsActive] = useState<string>('OPEN');

  const tabClasses = (type: string) => {
    return isActive === type
      ? " text-[var(--primary-color)] relative after:content-[''] after:w-1/3 after:h-0.5 after:absolute after:-bottom-3 after:left-0 after:translate-x-full after:bg-black "
      : '';
  };

  const handleOnClickOpen = () => {
    setIsActive('OPEN');
    onApplyFilter({ status: 'OPEN' });
  };

  const handleOnClickClosed = () => {
    setIsActive('CLOSED');
    onApplyFilter({ status: 'CLOSED' });
  };

  return (
    <div className="flex text-center text-sm h-12 justify-between items-center">
      <div
        className={clsx('flex-1 hover:cursor-pointer font-semibold ', tabClasses('OPEN'))}
        onClick={handleOnClickOpen}
      >
        Open
      </div>
      <div
        className={clsx('flex-1 hover:cursor-pointer font-semibold', tabClasses('CLOSED'))}
        onClick={handleOnClickClosed}
      >
        Closed
      </div>
    </div>
  );
}
