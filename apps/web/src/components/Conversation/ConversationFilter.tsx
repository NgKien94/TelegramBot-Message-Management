import { GetConversationRequest } from '@message-management/types';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { TextField } from '@radix-ui/themes';
import clsx from 'clsx';
import {  Dispatch, SetStateAction, useEffect, useState } from 'react';

interface ConversationFilterProps extends React.HTMLAttributes<HTMLDivElement> {
  filter: GetConversationRequest;
  onApplyFilter: Dispatch<SetStateAction<GetConversationRequest>>;
}

export default function ConversationFilter({ onApplyFilter, filter }: ConversationFilterProps) {
  const [searchValue, setSearchValue] = useState<string>('');
  const isActive = filter.status;

  const tabClasses = (type: string) => {
    return isActive === type
      ? " text-[var(--primary-color)] relative after:content-[''] after:w-1/3 after:h-0.5 after:absolute after:-bottom-3 after:left-0 after:translate-x-full after:bg-black "
      : '';
  };

  const handleChangeStatus = (status: 'OPEN' | 'CLOSED') => () => {
    onApplyFilter((prev) => {
      return {
        ...prev,
        status,
      };
    });
  };

  useEffect(() => {
    const debounceChangeSearchValue = setTimeout(() => {
      onApplyFilter((prev) => {
        if (searchValue) {
          return {
            ...prev,
            search: searchValue,
          };
        }

        delete prev.search

        return {
          ...prev,
        };
      });
    }, 1000);

    return () => clearTimeout(debounceChangeSearchValue);
  }, [searchValue, onApplyFilter]);

  return (
    <div className="filter-container p-3">
      <TextField.Root
        placeholder="Search a conversation ..."
        radius="full"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      >
        <TextField.Slot>
          <MagnifyingGlassIcon height="16" width="16" />
        </TextField.Slot>
      </TextField.Root>
      <div className="flex text-center text-sm h-12 justify-between items-center">
        <div
          className={clsx('flex-1 hover:cursor-pointer font-semibold ', tabClasses('OPEN'))}
          onClick={handleChangeStatus('OPEN')}
        >
          Open
        </div>
        <div
          className={clsx('flex-1 hover:cursor-pointer font-semibold', tabClasses('CLOSED'))}
          onClick={handleChangeStatus('CLOSED')}
        >
          Closed
        </div>
      </div>
    </div>
  );
}
