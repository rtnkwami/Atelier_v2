import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { ZodType } from 'zod';
import { RpcResponseValidator } from './response.validator';

export function ValidateRpcResponse(schema: ZodType) {
  return applyDecorators(
    SetMetadata('response-schema', schema),
    UseInterceptors(RpcResponseValidator),
  );
}
