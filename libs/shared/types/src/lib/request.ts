// =================AUTH================

import { MessageType, SenderType } from "./enum"

export type LoginRequest = {
  email: string
  password: string
}

// export type RegisterRequest = {
//   email: string
//   username: string
//   password: string
// }

export type LogoutRequest = {
  token: string // refresh_token
}

export type RefreshTokenRequest = {
  token: string // refresh_token
}

// ===============CONVERSATION============
export type UpdateConversationRequest = {
  isReadByAdmin?: boolean
  status?: string
}

// =================MESSAGE================
export type CreateMessageRequest = {
  fileUrl ?: string
  fileName ?: string
  content ?: string
  type ?: MessageType
  senderType : SenderType
  sentByAdmin : boolean
  conversationId : string
}
