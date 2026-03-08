import { ApiResponse, ValidationErrorResponse } from "@message-management/types";

export const isApiResponse = <T>(value: unknown): value is ApiResponse<T> => {
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
