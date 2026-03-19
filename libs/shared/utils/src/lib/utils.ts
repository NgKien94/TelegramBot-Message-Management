import { ApiResponseFromServer, ValidationErrorResponse } from '@message-management/types';

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

export const markdownToTelegramHtml = (text: string): string => {
  let result = text;

  // 1. Code block trước (tránh bị xử lý bởi các rule khác)
  result = result.replace(/```[\w]*\n?([\s\S]+?)```/gs, '<pre>$1</pre>');

  // 2. Inline code
  result = result.replace(/`([^`]+)`/g, '<code>$1</code>');

  // 3. Bold
  result = result.replace(/\*\*(.+?)\*\*/gs, '<b>$1</b>');

  // 4. Italic *text*
  result = result.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/gs, '<i>$1</i>');

  // 5. Underline __text__ (trước _text_ để tránh conflict)
  result = result.replace(/__(.+?)__/gs, '<u>$1</u>');

  // 6. Italic _text_ (sau __ để tránh conflict)
  result = result.replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/gs, '<i>$1</i>');

  // 7. Strikethrough
  result = result.replace(/~~(.+?)~~/gs, '<s>$1</s>');

  return result;
};
