// =================AUTH================

import { MessageType, SenderType } from './enum';

export type LoginRequest = {
  email: string;
  password: string;
};

// export type RegisterRequest = {
//   email: string
//   username: string
//   password: string
// }

export type LogoutRequest = {
  token: string; // refresh_token
};

export type RefreshTokenRequest = {
  token: string; // refresh_token
};

// ===============CONVERSATION============
export type GetConversationRequest = {
  search?: string;
  status?: string;
};

export type UpdateConversationRequest = {
  isReadByAdmin?: boolean;
  status?: string;
};

// =================MESSAGE================
export type CreateMessageRequest = {
  fileUrls?: string[];
  content?: string;
  type?: MessageType;
  senderType: SenderType;
  sentByAdmin: string | null;
  conversationId: string;
};

export type SendMessageBroadcastRequest = {
  fileUrls?: string[];
  content?: string;
  type?: MessageType;
  sentByAdmin: string
  conversationIds: string[]
};

// ==============WELCOME MESSAGE============
export type UpdateWelcomeMessageRequest = {
  message: string
}
