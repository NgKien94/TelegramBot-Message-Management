import { HiUserGroup } from 'react-icons/hi2';
import { BsChatSquareQuoteFill, BsMegaphone } from 'react-icons/bs';
import { TbSettings2 } from 'react-icons/tb';
import { NavLink } from 'react-router-dom';

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  onOpenBroadCastModal: () => void;
}

export default function Sidebar({ onOpenBroadCastModal }: SidebarProps) {
  return (
    <aside className="w-20 bg-[var(--primary-color)] shrink-0 flex flex-col items-center py-6 gap-4">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `group relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 ease-linear ${
            isActive ? 'bg-white' : 'hover:bg-white'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <HiUserGroup
              className={`text-xl transition-colors ${isActive ? 'text-black' : 'text-white group-hover:text-black'}`}
            />
            <span className="absolute left-16 whitespace-nowrap bg-black text-white text-sm px-3 py-1 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition">
              Users
            </span>
          </>
        )}
      </NavLink>

      <NavLink
        to="/conversations"
        className={({ isActive }) =>
          `group relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 ease-linear ${
            isActive ? 'bg-white' : 'hover:bg-white'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <BsChatSquareQuoteFill
              className={`text-xl transition-colors ${isActive ? 'text-black' : 'text-white group-hover:text-black'}`}
            />
            <span className="absolute left-16 whitespace-nowrap bg-black text-white text-sm px-3 py-1 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition">
              Conversations
            </span>
          </>
        )}
      </NavLink>

      <button
        onClick={onOpenBroadCastModal}
        className="group relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white transition-all duration-200 ease-linear"
      >
        <BsMegaphone className="text-xl text-white group-hover:text-black transition-colors" />
        <span className="absolute left-16 whitespace-nowrap bg-black text-white text-sm px-3 py-1 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition">
          Send broadcast messages
        </span>
      </button>

      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `group relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 ease-linear ${
            isActive ? 'bg-white' : 'hover:bg-white'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <TbSettings2
              className={`text-xl transition-colors ${isActive ? 'text-black' : 'text-white group-hover:text-black'}`}
            />
            <span className="absolute left-16 whitespace-nowrap bg-black text-white text-sm px-3 py-1 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition">
              Settings
            </span>
          </>
        )}
      </NavLink>
    </aside>
  );
}
