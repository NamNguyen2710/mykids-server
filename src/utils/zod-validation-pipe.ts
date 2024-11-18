import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema<any>) {}

  public transform(value: unknown): unknown {
    if (this.schema) {
      const parseResult = this.schema.safeParse(value);

      if (!parseResult.success) {
        const { error } = parseResult;
        const message = error.errors.map(
          (error) => `${error.path.join('.')}: ${error.message}`,
        );
        const data = error.errors.reduce((acc, error) => {
          acc[error.path.join('.')] = error.message;
          return acc;
        }, {});

        throw new BadRequestException({ message, data, statusCode: 400 });
      }

      return parseResult.data;
    }

    return value;
  }
}
