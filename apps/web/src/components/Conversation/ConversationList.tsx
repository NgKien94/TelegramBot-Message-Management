import { useQuery } from '@tanstack/react-query';
import ConversationItem from './ConversationItem';
import { getConversationsList } from '@message-management/client';
import { Dispatch, SetStateAction } from 'react';

interface ConversationListProps extends React.HTMLAttributes<HTMLDivElement> {
  setConversation: Dispatch<SetStateAction<string | undefined>>
}

export default function ConversationList({setConversation,...rest}: ConversationListProps) {
  const { isSuccess, data } = useQuery({
    queryKey: ['conversation-list'],
    queryFn: () => getConversationsList(),
  });

  return (
    <div {...rest} className="px-3 w-80 h-screen flex flex-col">
      {isSuccess &&
        data.result.map((conversation) => (
          <ConversationItem conversation={conversation} onClick={()=> setConversation(conversation.id)} key={conversation.id}/>
        ))}
    </div>
  );
}
