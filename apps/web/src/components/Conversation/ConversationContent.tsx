import { useEffect, useRef } from 'react';
import ChatInput from './ChatInput';
import MessageBubble from './MessageBubble';
import UserCard from './UserCard';

export default function ConversationContent() {
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    if(historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight
    }
  },[])

  
  return (
    <div className="w-full h-screen flex flex-col">
      <UserCard />
      <div ref={historyRef} className="conversation-history p-5 h-64 overflow-auto flex-1 flex flex-col gap-3">
        <MessageBubble
          type="incoming"
          content="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Architecto laudantium tempore fugit aliquid sapiente debitis dolorum maxime voluptatum delectus quod?
"
          sendTime={new Date()}
        />
        <MessageBubble
          type="incoming"
          content="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Architecto laudantium tempore fugit aliquid sapiente debitis dolorum maxime voluptatum delectus quod?
"
          sendTime={new Date()}
        />
        <MessageBubble type="outgoing" content="How are you ?" sendTime={new Date()}  />

        <MessageBubble
          type="outgoing"
          content="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugiat, adipisci."
          sendTime={new Date()}
        />
        <MessageBubble
          type="outgoing"
          content="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugiat, adipisci."
          sendTime={new Date()}
        />
        <MessageBubble type="outgoing" content="What's up ?" sendTime={new Date()} />
        <MessageBubble
          type="outgoing"
          content="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
        sendTime={new Date()}
        />
        <MessageBubble type="outgoing" content="How are you ?" sendTime={new Date()}/>
        <MessageBubble type="outgoing" content="How are you ?" sendTime={new Date()}/>
        <MessageBubble type="outgoing" content="How are you ?"sendTime={new Date()} />
        <MessageBubble type="outgoing" content="How are you ?" sendTime={new Date()}/>
        <MessageBubble type="outgoing" content="How are you ?" sendTime={new Date()}/>
        <MessageBubble type="outgoing" content="How are you ?" sendTime={new Date()}/>
        <MessageBubble type="outgoing" content="How are you ?" sendTime={new Date()}/>
        <MessageBubble type="outgoing" content="How are you ?" sendTime={new Date()}/>
        <MessageBubble
          type="incoming"
          content="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Architecto laudantium tempore fugit aliquid sapiente debitis dolorum maxime voluptatum delectus quod?
"
        sendTime={new Date()}
        />
        <MessageBubble
          type="incoming"
          content="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Architecto laudantium tempore fugit aliquid sapiente debitis dolorum maxime voluptatum delectus quod?
"
          sendTime={new Date()}
        />
        <MessageBubble type="outgoing" content="How are you ?" sendTime={new Date()} />
        <MessageBubble
          type="incoming"
          content="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Architecto laudantium tempore fugit aliquid sapiente debitis dolorum maxime voluptatum delectus quod?
"
          sendTime={new Date()}
        />
        <MessageBubble
          type="incoming"
          content="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Architecto laudantium tempore fugit aliquid sapiente debitis dolorum maxime voluptatum delectus quod?
"
          sendTime={new Date()}
        />
        <MessageBubble type="outgoing" content="How are you ?" sendTime={new Date()} />
      </div>
      <div className="conversation-action w-full h-16 bg-gray-100">
        <ChatInput />
      </div>
    </div>
  );
}
