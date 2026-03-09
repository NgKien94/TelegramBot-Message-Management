import { HiUserGroup } from "react-icons/hi2";
import { BsChatSquareQuoteFill } from "react-icons/bs";
import { VscSettingsGear } from "react-icons/vsc";

import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-24 bg-[var(--primary-color)] shrink-0 flex flex-col items-center py-6 gap-4">

      <Link
        to="/"
        className="group relative w-14 h-14 flex items-center justify-center rounded-xl hover:bg-white transition-all duration-200 ease-linear"
      >
        <HiUserGroup className="text-2xl text-white group-hover:text-black transition-colors" />
         <span className="absolute left-16 whitespace-nowrap bg-black text-white text-sm px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition">
          Users
        </span>
      </Link>

      <Link
        to="/conversations"
        className="group relative w-14 h-14 flex items-center justify-center rounded-xl hover:bg-white transition-all duration-200"
      >
        <BsChatSquareQuoteFill className="text-2xl text-white group-hover:text-black transition-colors" />
        <span className="absolute left-16 whitespace-nowrap bg-black text-white text-sm px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition">
          Conversations
        </span>
      </Link>

      <Link
        to="/settings"
        className="group relative w-14 h-14 flex items-center justify-center rounded-xl hover:bg-white transition-all duration-200"
      >
        <VscSettingsGear className="text-2xl text-white group-hover:text-black transition-colors" />
        <span className="absolute left-16 whitespace-nowrap bg-black text-white text-sm px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition">
          Settings
        </span>
      </Link>

    </aside>
  );
}
