import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RpcException } from '@nestjs/microservices';
import { PinoLogger } from 'nestjs-pino';
import { map, Observable } from 'rxjs';
import z, { ZodType } from 'zod';

@Injectable()
export class RpcResponseValidator implements NestInterceptor {
  constructor(
    private readonly logger: PinoLogger,
    private readonly reflector: Reflector,
  ) {
    this.logger.setContext('RpcResponseValidation');
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const schema = this.reflector.get<ZodType>(
      'response-schema',
      context.getHandler(),
    );

    return next.handle().pipe(
      map((response) => {
        const result = schema.safeParse(response);

        if (result.error) {
          const { fieldErrors, formErrors } = z.flattenError(result.error);
          this.logger.error(
            {
              invalidFields: fieldErrors,
              unknownFields: formErrors,
            },
            'response body is in violation of response contract',
          );
          throw new RpcException('internal server error');
        }
        return result.data;
      }),
    );
  }
}
