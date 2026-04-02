import { ApiResponseFromServer, ValidationErrorResponse } from '@message-management/types';
import sanitizeHtml from 'sanitize-html';
import axios from 'axios';

export const isApiResponseFromServer = <T>(value: unknown): value is ApiResponseFromServer<T> => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'success' in value &&
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    typeof (value as any).success === 'boolean'
  );
};

export const isValidationErrorResponse = (value: unknown): value is ValidationErrorResponse => {
  return typeof value === 'object' && value !== null && 'message' in value && Array.isArray(value.message);
};

export function sanitizeToTelegramHtml(html: string): string {
  const cleanedHtml = sanitizeHtml(html, {
    allowedTags: ['b', 'strong', 'i', 'em', 'code', 's', 'strike', 'del', 'u'],
  });
  return cleanedHtml;
}

export function removeAllHTMLTagToText(html: string): string {
  const result = sanitizeHtml(html, {
    allowedTags: [],
  });
  return result;
}

export const downloadToBase64 = async (url: string): Promise<string> => {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const base64 = Buffer.from(response.data).toString('base64');
  return `data:image/jpeg;base64,${base64}`;
};

export const toBase64FromBlob = (blob: Blob): Promise<string> =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });

 export const formatTimestamp = (timestamp: string | number): string => {
  const date = new Date(timestamp);
  const today = new Date();

  const toDateOnly = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const dateOnly = toDateOnly(date);
  const todayOnly = toDateOnly(today);

  const diffMs = todayOnly.getTime() - dateOnly.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
}
