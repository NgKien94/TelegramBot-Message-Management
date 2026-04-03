import { MessageType, SenderType } from "@message-management/types";

export type JobTypeOfNewQueue = {
  jobName: string;
  conversationId: string;
  payload: {
    fileUrl?: string[];
    content?: string;
    type?: MessageType;
    senderType: SenderType;
    sentByAdmin: string;
  };
};
