export type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};
