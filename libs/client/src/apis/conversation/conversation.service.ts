import { ApiDataForClient, ChatHistoryOfConversation, Conversation, UpdateConversationRequest } from '@message-management/types';
import { http } from '@message-management/utils';

export const getConversationsList = () => {
  return http.get<unknown, ApiDataForClient<Conversation[]>>('/conversations');
};

export const getChatHistoryOfConversation = (conversationId: string) => {
  return http.get<unknown, ApiDataForClient<ChatHistoryOfConversation>>(`/conversations/${conversationId}`)
}

export const updateConversation = (conversationId: string, body: UpdateConversationRequest) => {
  return http.patch<unknown,ApiDataForClient<Conversation>>(`/conversations/${conversationId}`, body)
}
