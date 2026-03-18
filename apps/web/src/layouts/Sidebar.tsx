import { HiUserGroup } from "react-icons/hi2";
import { BsChatSquareQuoteFill, BsMegaphone } from "react-icons/bs";
import { TbSettings2 } from "react-icons/tb";
import { Link } from "react-router-dom";

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  onOpenBroadCastModal: () => void
}


export default function Sidebar({onOpenBroadCastModal}: SidebarProps) {
  return (
    <aside className="w-20 bg-[var(--primary-color)] shrink-0 flex flex-col items-center py-6 gap-4">

      <Link
        to="/"
        className="group relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white transition-all duration-300 ease-linear"
      >
        <HiUserGroup className="text-xl text-white group-hover:text-black transition-colors" />
         <span className="absolute left-16 whitespace-nowrap bg-black text-white text-sm px-3 py-1 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition">
          Users
        </span>
      </Link>

      <Link
        to="/conversations"
        className="group relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white transition-all duration-300 ease-linear"
      >
        <BsChatSquareQuoteFill className="text-xl text-white group-hover:text-black transition-colors" />
        <span className="absolute left-16 whitespace-nowrap bg-black text-white text-sm px-3 py-1 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition">
          Conversations
        </span>
      </Link>

      <button
        onClick={onOpenBroadCastModal}
        className="group relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white transition-all duration-300 ease-linear"
      >
        <BsMegaphone  className="text-xl text-white group-hover:text-black transition-colors" />
        <span className="absolute left-16 whitespace-nowrap bg-black text-white text-sm px-3 py-1 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition">
          Send broadcast messages
        </span>
      </button>

      <Link
        to="/settings"
        className="group relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white transition-all duration-300 ease-linear"
      >
        <TbSettings2  className="text-xl text-white group-hover:text-black transition-colors" />
        <span className="absolute left-16 whitespace-nowrap bg-black text-white text-sm px-3 py-1 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition">
          Settings
        </span>
      </Link>

    </aside>
  );
}
