export type ApiError = {
  data?: {
    [key: string]: {
      message?: string;
    };
  };
  message?: string;
}