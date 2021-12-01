import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';
import { BusinessError } from './business.error';

/**
 * Exception filter.
 * If you add custom Error types, be sure to add a proper translation to an HttpStatusCode here
 * Use this filter by adding
 * @UseFilters(new ErrorFilter())
 * to your controller
 */

@Catch(Error)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const timestamp = new Date().toISOString();
    let status = exception.status ?? 500;
    let message = exception.message ?? 'Uncaught exception error';

    switch (exception.constructor) {
      case BusinessError:
        Logger.warn('ERROR (business):', timestamp, exception);
        status = (exception as BusinessError).getHttpStatusCode();
        break;
      case HttpException:
        Logger.warn('HttpException:', timestamp, exception);
        status = (exception as HttpException).getStatus();
        break;
      case ValidationError:
        Logger.warn('ValidationError:', timestamp, exception);
        status = 400;
        break;
      default:
        Logger.warn('ERROR (uncaught):', timestamp, exception);
        message = exception.response?.message ?? exception.message;
    }

    response.status(status).json({
      statusCode: status,
      path: request.url,
      message: message,
      name: exception.name,
      timestamp: timestamp,
    });
  }
}
