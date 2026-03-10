import { ApiResponseFromServer, ValidationErrorResponse } from "@message-management/types";

export const isApiResponseFromServer = <T>(value: unknown): value is ApiResponseFromServer<T> => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'success' in value &&
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    typeof (value as any).success === 'boolean'
  );
};

export const isValidationErrorResponse = (
  value: unknown,
): value is ValidationErrorResponse => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    Array.isArray(value.message)
  );
};
