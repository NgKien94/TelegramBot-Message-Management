import { io } from 'socket.io-client';

export const socket = io('localhost:3000', {
  autoConnect: false,
  auth: (cb) => {
    const token = localStorage.getItem('access_token'); // get new token when connect socket
    cb({ token });
  },
});
