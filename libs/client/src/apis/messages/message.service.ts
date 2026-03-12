import { CreateMessageRequest } from "@message-management/types"
import { http } from "@message-management/utils"

export const createMessage = (body: CreateMessageRequest) => {
  return http.post("messages", body)
}
