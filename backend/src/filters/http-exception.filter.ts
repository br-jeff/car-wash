import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

type ClassValidatorError = {
  exception: string;
  response: { message: string[]; error: string; statusCode: number };
};

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: ClassValidatorError | HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isClassValidatorError = (
      exception: any,
    ): exception is ClassValidatorError => {
      return (
        typeof exception === 'object' &&
        'response' in exception &&
        'statusCode' in exception.response
      );
    };

    const status = isClassValidatorError(exception)
      ? exception.response.statusCode
      : (exception as HttpException).getStatus();

    const message = isClassValidatorError(exception)
      ? exception.response.message
      : (exception as HttpException).getResponse()['message'];

    console.log({ exception });

    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
