import { CreateMessageRequest, SendMessageBroadcastRequest } from '@message-management/types';
import { http } from '@message-management/utils';

export const createMessage = (body: CreateMessageRequest) => {
  return http.post('messages', body);
};

export const sendBroadcastMessage = (body: SendMessageBroadcastRequest) => {
  return http.post('broadcast/messages', body);
};
