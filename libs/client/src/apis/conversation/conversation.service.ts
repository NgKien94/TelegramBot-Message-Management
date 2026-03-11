import { ApiDataForClient, ChatHistoryOfConversation, Conversation } from '@message-management/types';
import { http } from '@message-management/utils';

export const getConversationsList = () => {
  return http.get<unknown, ApiDataForClient<Conversation[]>>('/conversations');
};

export const getChatHistoryOfConversation = (conversationId: string) => {
  return http.get<unknown, ApiDataForClient<ChatHistoryOfConversation>>(`/conversations/${conversationId}`)
}
