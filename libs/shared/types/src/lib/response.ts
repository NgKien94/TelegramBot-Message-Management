export type PaginationMeta = {
  totalRecord: number;
  totalPages: number;
  currentPage: number;
  limit: number;
};

export type ApiResponseFromServer<T> = {
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


export type ApiDataForClient<T> = {
  result: T
  meta?: PaginationMeta
}

export type ApiErrorForClient = {
  success: boolean
  error: {
    message: string
    statusCode: number
  }
}
