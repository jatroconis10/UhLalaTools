export const throwError = (httpStatusCode: number, errorMessage = 'Default Error') => {
  const error: any = new Error(errorMessage);
  error.httpStatusCode = httpStatusCode;
  throw error;
};
