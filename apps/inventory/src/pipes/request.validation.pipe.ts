import { BadRequestException, PipeTransform } from '@nestjs/common';
import z, { ZodType } from 'zod';

export class HttpRequestValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodType) {}

  transform(value: any) {
    const result = this.schema.safeParse(value);

    if (result.error) {
      const flattenedErrors = z.flattenError(result.error);

      throw new BadRequestException({
        message: 'request body is invalid',
        invalidFields: flattenedErrors.fieldErrors,
        unknownFields: flattenedErrors.formErrors,
      });
    }
    return result.data;
  }
}
