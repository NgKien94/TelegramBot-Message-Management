// ============COMMON==============
export type PaginationMeta = {
  totalRecord: number;
  totalPages: number;
  currentPage: number;
  limit: number;
};

export type ApiResponseFromServer<T> = {
  success: boolean;
  data?:
    | T
    | {
        result: T[];
        meta: PaginationMeta;
      };

  error?: {
    message: string;
    statusCode: number;
  };
};

export type ValidationErrorResponse = {
  message: string[];
  error: string;
  statusCode: number;
};

export type ApiDataForClient<T> = {
  result: T;
  meta?: PaginationMeta;
};

export type ApiErrorForClient = {
  success: boolean;
  error: {
    message: string;
    statusCode: number;
  };
};

// ==============CONVERSATION===============
export type Conversation = {
  id: string;
  status: string;
  isReadByAdmin: boolean;
  telegramUser: TelegramUser;
  lastMessage: {
    id: string;
    content: string;
    type: string;
    sentbyAdmin: boolean;
    senderType: string;
  };
  lastMessageAt: string;
};

export type ChatHistoryOfConversation = {
  id: string;
  telegramUser: TelegramUser;
  messages: Messages[];
};

// ==============MESSAGES==============
export type Messages = {
  id: string;
  fileUrl: string | null;
  fileName: string | null;
  content: string | undefined;
  type: string;
  senderType: string;
  sentByAdmin: boolean;
  conversationId: string;
  createdAt: string;
};

export type TelegramUser = {
  telegramID: string;
  firstName: string;
  username?: string;
  lastName?: string;
  avatarUrl?: string;
};
