import { ApiDataForClient, UpdateWelcomeMessageRequest, WelcomeMessage } from "@message-management/types";
import { http } from "@message-management/utils";

export const getWelcomeMessage = () => {
  return http.get<unknown, ApiDataForClient<WelcomeMessage>>('/welcome-message')
}

export const updateWelcomeMessage = (body: UpdateWelcomeMessageRequest) => {
  return http.put('/welcome-message', body);
};
