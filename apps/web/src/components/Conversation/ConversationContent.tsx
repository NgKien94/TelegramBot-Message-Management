import { useEffect, useRef } from 'react';
import ChatInput from './ChatInput';
import MessageBubble from './MessageBubble';
import UserCard from './UserCard';
import { useQuery } from '@tanstack/react-query';
import { getChatHistoryOfConversation } from '@message-management/client';
import EmptyConversation from './EmptyConversation';

interface ConversationContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  conversationId?: string;
}

export default function ConversationContent({
  conversationId,
}: ConversationContentProps) {
  const { isSuccess, isError, data } = useQuery({
    queryKey: ['chat-history', conversationId],
    queryFn: () => getChatHistoryOfConversation(conversationId || ''),
    enabled: !!conversationId,
  });

  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [data]);

  return (
    <div className="w-full h-screen flex flex-col">
      {(!conversationId || isError) && <EmptyConversation />}
      {isSuccess && (
        <>
          <UserCard user={data.result.telegramUser} />
          <div
            ref={historyRef}
            className="conversation-history p-5 h-64 overflow-auto flex-1 flex flex-col gap-3"
          >
            {data &&
              data.result.messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  senderType={message.senderType}
                  content={message.content}
                  sendTime={new Date(message.createdAt)}
                />
              ))}
            {/* <MessageBubble
              senderType="incoming"
              content="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Architecto laudantium tempore fugit aliquid sapiente debitis dolorum maxime voluptatum delectus quod?
"
              sendTime={new Date()}
            />
            <MessageBubble
              senderType="incoming"
              content="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Architecto laudantium tempore fugit aliquid sapiente debitis dolorum maxime voluptatum delectus quod?
"
              sendTime={new Date()}
            />
            <MessageBubble
              senderType="outgoing"
              content="How are you ?"
              sendTime={new Date()}
            />

            <MessageBubble
              senderType="outgoing"
              content="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugiat, adipisci."
              sendTime={new Date()}
            />
            <MessageBubble
              senderType="outgoing"
              content="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugiat, adipisci."
              sendTime={new Date()}
            />
            <MessageBubble
              senderType="outgoing"
              content="What's up ?"
              sendTime={new Date()}
            />
            <MessageBubble
              senderType="outgoing"
              content="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
              sendTime={new Date()}
            />
            <MessageBubble
              senderType="outgoing"
              content="How are you ?"
              sendTime={new Date()}
            />
            <MessageBubble
              senderType="outgoing"
              content="How are you ?"
              sendTime={new Date()}
            />
            <MessageBubble
              senderType="outgoing"
              content="How are you ?"
              sendTime={new Date()}
            />
            <MessageBubble
              senderType="outgoing"
              content="How are you ?"
              sendTime={new Date()}
            />
            <MessageBubble
              senderType="outgoing"
              content="How are you ?"
              sendTime={new Date()}
            />
            <MessageBubble
              senderType="outgoing"
              content="How are you ?"
              sendTime={new Date()}
            />
            <MessageBubble
              senderType="outgoing"
              content="How are you ?"
              sendTime={new Date()}
            />
            <MessageBubble
              senderType="outgoing"
              content="How are you ?"
              sendTime={new Date()}
            />
            <MessageBubble
              senderType="incoming"
              content="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Architecto laudantium tempore fugit aliquid sapiente debitis dolorum maxime voluptatum delectus quod?
"
              sendTime={new Date()}
            />
            <MessageBubble
              senderType="incoming"
              content="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Architecto laudantium tempore fugit aliquid sapiente debitis dolorum maxime voluptatum delectus quod?
"
              sendTime={new Date()}
            />
            <MessageBubble
              senderType="outgoing"
              content="How are you ?"
              sendTime={new Date()}
            />
            <MessageBubble
              senderType="incoming"
              content="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Architecto laudantium tempore fugit aliquid sapiente debitis dolorum maxime voluptatum delectus quod?
"
              sendTime={new Date()}
            />
            <MessageBubble
              senderType="incoming"
              content="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Architecto laudantium tempore fugit aliquid sapiente debitis dolorum maxime voluptatum delectus quod?
"
              sendTime={new Date()}
            />
            <MessageBubble
              senderType="outgoing"
              content="How are you ?"
              sendTime={new Date()}
            /> */}
          </div>
          <div className="conversation-action w-full h-16 bg-gray-100">
            <ChatInput />
          </div>
        </>
      )}
    </div>
  );
}
