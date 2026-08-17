import { TelegramUser } from "@message-management/types";

interface UserCardProps extends React.HTMLAttributes<HTMLDivElement> {
  user: TelegramUser
}

export default function UserCard({
  user,
  ...rest
}: UserCardProps) {
  return (
    <div className="user-info px-3 flex justify-start items-center gap-3 h-16 bg-gray-50 border-gray-200 border">
      <img
        className="object-cover w-12 h-12 rounded-full"
        src={user.avatarUrl}
        alt={`${user.lastName} ${user.firstName}`}
      />
      <div>
        <p className="text-sm font-semibold">{user.firstName}{' '}{user.lastName || ''}</p>
        <p className="text-xs text-sky-500">@{user.username || user.telegramID}</p>
      </div>
    </div>
  );
}
