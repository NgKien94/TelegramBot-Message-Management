export type TokenPayload = {
  accountId: string
};

export type PaginationMeta = {
  totalRecord: number;
  totalPages: number;
  currentPage: number;
  limit: number;
};

export type ApiResponse<T> = {
  success: boolean;
  data?:
    | T
    | {
        result: T[];
        meta: PaginationMeta;
      };

  error?: {
    message: string;
    statusCode: number;
  };
};

export type ValidationErrorResponse = {
  message: string[];
  error: string;
  statusCode: number;
};

