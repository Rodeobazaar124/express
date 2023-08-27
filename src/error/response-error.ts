class ResponseError extends Error {
  status: any;
  constructor(status: any, message: any) {
    super(message);
    this.status = status;
  }
}

export { ResponseError };
