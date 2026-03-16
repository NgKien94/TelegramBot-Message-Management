import { Conversation } from '@message-management/types';
import { CiRead, CiUnread } from 'react-icons/ci';

interface ConversationItemProps extends React.HTMLAttributes<HTMLDivElement> {
  conversation: Conversation;
}

export default function ConversationItem({
  conversation,
  ...rest
}: ConversationItemProps) {
  return (
    <div
      {...rest}
      className="mt-1 hover:bg-gray-100 hover:cursor-pointer hover:shadow p-2  hover:translate-x-1 hover:rounded-md transition-all duration-200 ease-linear w-full flex justify-start items-center gap-2"
    >
      <img
        className="object-cover w-12 h-12 rounded-full"
        src={conversation.telegramUser.avatarUrl}
        alt={
          conversation.telegramUser.username ||
          conversation.telegramUser.telegramID
        }
      />
      <div className="card-info flex-1 flex flex-col">
        <div className="card-header flex justify-between items-center">
          <p className="text-sm font-semibold">
            {conversation.telegramUser.username ||
              conversation.telegramUser.telegramID}
          </p>
          <p className="text-gray-500 text-sm">
            {new Date(conversation.lastMessageAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="card-content flex justify-between items-center">
          <p className="max-w-48 line-clamp-1 text-sm text-gray-500">
            {conversation.lastMessage.senderType === 'INCOMING'
              ? `${conversation.telegramUser.username || conversation.telegramUser.telegramID}: `
              : 'System: '}
            {conversation.lastMessage.type === 'FILE'
              ? 'Sent a file'
              : conversation.lastMessage.content}
          </p>
          {conversation.isReadByAdmin ? <CiRead className='text-xl' /> : <CiUnread className='text-blue-700 text-xl animate-bounce'/>}
        </div>
      </div>
    </div>
  );
}
