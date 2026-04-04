import { Conversation, Messages, TelegramUser, UpdateConversationRequest } from '@message-management/types';
import { BiArchiveOut } from 'react-icons/bi';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateConversation } from '@message-management/client';
import { toast } from 'react-toastify';
import { MouseEvent } from 'react';
import clsx from 'clsx';
import { removeAllHTMLTagToText } from '@message-management/utils';

interface ConversationItemProps extends React.HTMLAttributes<HTMLDivElement> {
  conversation: Conversation;
}

const getSenderLabel = (
  message: Omit<Messages, 'fileUrls' | 'conversationId' | 'createdAt'>,
  telegramUser: TelegramUser,
) => {
  if (message.senderType === 'INCOMING') {
    return `${telegramUser.username || telegramUser.telegramID}: `;
  }

  if (message.sentByAdmin) {
    const adminId = localStorage.getItem('id');

    if (message.sentByAdmin.id === adminId) {
      return 'Admin(You): ';
    }

    return `Admin(${message.sentByAdmin.name}): `;
  }

  return 'Bot: ';
};

export default function ConversationItem({ conversation, ...rest }: ConversationItemProps) {
  // const queryClient = useQueryClient();

  // const updateConversationMutation = useMutation({
  //   mutationFn: ({ conversationId, body }: { conversationId: string; body: UpdateConversationRequest }) =>
  //     updateConversation(conversationId, body),
  //   onSuccess: () => {
  //     toast.success('Closed conversation successfully');
  //     queryClient.invalidateQueries({
  //       queryKey: ['conversation-list'],
  //     });
  //   },
  //   onError: (err) => {
  //     console.log('Error when closed conversation: ', err);
  //     toast.error('Closed conversation failed');
  //   },
  // });

  const handleClickClosed = async (e: MouseEvent<SVGElement, globalThis.MouseEvent>) => {
    e.stopPropagation();
    // updateConversationMutation.mutate({
    //   conversationId: conversation.id,
    //   body: {
    //     status: 'CLOSED',
    //   },
    // });
    try {
      await updateConversation(conversation.id, { status: 'CLOSED' });
      toast.success('Closed conversation successfully');
    } catch (error) {
      console.log('Error when closed conversation: ', error);
      toast.error('Closed conversation failed');
    }
  };

  return (
    <div
      {...rest}
      className={clsx(
        ' hover:bg-gray-100 hover:cursor-pointer hover:shadow p-2  hover:translate-x-1 hover:rounded-md transition-all duration-200 ease-linear w-full flex justify-start items-center gap-2',
        conversation.isReadByAdmin
          ? ' border border-gray-200 rounded-lg'
          : ' border border-blue-400 rounded-lg bg-gray-50',
      )}
    >
      <img
        className={clsx('object-cover w-14 h-14 rounded-full')}
        src={conversation.telegramUser.avatarUrl}
        alt={conversation.telegramUser.username || conversation.telegramUser.telegramID}
      />
      <div className="card-info flex-1 flex flex-col">
        <div className="card-header flex justify-between items-center">
          <p
            className={clsx(
              'text-sm',
              conversation.isReadByAdmin ? ' font-semibold text-gray-800' : ' text-[var(--primary-color)] font-bold',
            )}
          >
            {conversation.telegramUser.username || conversation.telegramUser.telegramID}
          </p>
          <p className="text-gray-500 text-sm">
            {new Date(conversation.lastMessageAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="card-content flex justify-between items-center">
          <div className="w-full line-clamp-1 text-sm text-gray-500">
            <span className="inline-block text-gray-500 font-medium">
              {getSenderLabel(conversation.lastMessage, conversation.telegramUser)}
            </span>
            <span className="inline-block ml-1">
              {Boolean(conversation.lastMessage.content) === false
                ? 'Sent photo'
                : removeAllHTMLTagToText(conversation.lastMessage.content)}
            </span>
          </div>
          <div className="flex gap-2 text-xl justify-center items-center group">
            {conversation.status === 'OPEN' ? (
              <BiArchiveOut
                className="text-2xl text-gray-400 hover:text-gray-700 transition duration-200 ease-linear"
                onClick={handleClickClosed}
              />
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
