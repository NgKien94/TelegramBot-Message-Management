import { CiRead } from "react-icons/ci";

export default function ConversationItem() {
  return (
    <div className="mt-1 hover:bg-gray-100 hover:cursor-pointer hover:shadow p-2  hover:translate-x-1 hover:rounded-md transition-all duration-200 ease-linear w-full flex justify-start items-center gap-2">
      <img className="object-cover w-12 h-12 rounded-full" src="https://images.unsplash.com/photo-1772733694354-3b4a33568ef4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8" alt="" />
      <div className="card-info flex flex-col">
          <div className="card-header flex justify-between items-center">
            <p className="text-sm font-semibold">Username</p>
            <p className="text-gray-500 text-sm">August 8</p>
          </div>
          <div className="card-content flex justify-between items-center">
            <p className="max-w-48 line-clamp-1 text-sm text-gray-500">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum temporibus, doloribus amet numquam est quasi? Atque aliquid hic, quo soluta molestias voluptatum totam vel reiciendis consequuntur optio praesentium dolorum odit.</p>
            <CiRead />
          </div>
      </div>
    </div>
  )
}
