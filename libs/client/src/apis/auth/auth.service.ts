import {
  ApiDataForClient,
  LoginRequest,
  LogoutRequest,
} from '@message-management/types';
import { http } from '@message-management/utils';

export const login = (body: LoginRequest) => {
  return http.post('auth/login', body);
};

export const logout = (body: LogoutRequest) => {
  return http.post('auth/logout', body);
};

export const getMe = () => {
  return http.get<
    unknown,
    ApiDataForClient<{
      id: string;
      email: string;
      name: string
    }>
  >('auth/me');
};
