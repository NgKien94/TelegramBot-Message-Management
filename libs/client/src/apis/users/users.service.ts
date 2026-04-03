import { ApiDataForClient } from "@message-management/types";
import { http } from "@message-management/utils";

export const getUsers = () => {
  return http.get<
    unknown,
    ApiDataForClient<{
      telegramID: string,
      username: string,
      firstName: string,
      lastName: string,
      conversation: {
        id: string
        isReadByAdmin: boolean
      }
    }[]>
  >('users');
};
