export default function UserCard() {
  return (
    <div className="user-info px-3 flex justify-start items-center gap-3 h-16 bg-gray-50 border-gray-200 border">
      <img
        className="object-cover w-12 h-12 rounded-full"
        src="https://images.unsplash.com/photo-1772733694354-3b4a33568ef4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8"
        alt=""
      />
      <p className="text-sm font-semibold">Telegram fullname</p>
    </div>
  );
}
