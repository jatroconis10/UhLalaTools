export const throwError = (httpStatusCode: number, errorMessage: string) => {
  const error: any = new Error(errorMessage || 'Default Error');
  error.httpStatusCode = httpStatusCode;
  throw error;
};
