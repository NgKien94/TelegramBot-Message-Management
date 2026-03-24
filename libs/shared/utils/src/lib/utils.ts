import { ApiResponseFromServer, ValidationErrorResponse } from '@message-management/types';
import sanitizeHtml from 'sanitize-html';

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
    allowedTags: []
  });
  return result
}
