import { ApiDataForClient, ChatHistoryOfConversation, Conversation, GetConversationRequest, UpdateConversationRequest } from '@message-management/types';
import { http } from '@message-management/utils';

export const getConversationsList = (filter: GetConversationRequest) => {
  return http.get<unknown, ApiDataForClient<Conversation[]>>('/conversations', {
    params: {
      search: filter.search,
      status: filter.status
    }
  });
};

export const getChatHistoryOfConversation = (conversationId: string) => {
  return http.get<unknown, ApiDataForClient<ChatHistoryOfConversation>>(`/conversations/${conversationId}`)
}

export const updateConversation = (conversationId: string, body: UpdateConversationRequest) => {
  return http.patch<unknown,ApiDataForClient<Conversation>>(`/conversations/${conversationId}`, body)
}
