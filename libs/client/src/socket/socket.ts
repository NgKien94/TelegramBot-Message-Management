import { io, Socket } from 'socket.io-client';

export const socket: Socket = io('/', {
  autoConnect: false,
  auth: (cb) => {
    const token = localStorage.getItem('access_token'); // get new token when connect socket
    cb({ token });
  },
});

export const setSocketURL = (url: string) => {
  (socket.io as any).uri = url;
};
