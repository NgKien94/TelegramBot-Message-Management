import { ApiDataForClient } from '@message-management/types';
import { http } from '@message-management/utils';

export const uploadImage = (file: Blob | File) => {
  const formData = new FormData();
  formData.append('file', file, 'image.jpg');

  const response = http.post<unknown, ApiDataForClient<{ url: string }>>(`/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response;
};
