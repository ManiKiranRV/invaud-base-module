import { ErrorType } from 'core';

export class BusinessError extends Error {
  constructor(name: ErrorType, message: string) {
    super(message);
    this.name = name;
  }

  public getHttpStatusCode(): number {
    switch (this.name) {
      case ErrorType.Conflict:
        return 409;
      case ErrorType.NotFound:
        return 404;
      case ErrorType.Unauthorized:
        return 401;
      default:
        return 500;
    }
  }
}
