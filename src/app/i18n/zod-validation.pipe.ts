import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { z } from 'zod';
import { ZodIssueCode } from 'zod/v3';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: z.ZodType) {}

  transform(value: unknown, _metadata: ArgumentMetadata) {
    const result = this.schema.safeParse(value);
    if (result.success) {
      return result.data;
    }

    const i18n = I18nContext.current();
    const message = result.error.issues.map((issue) => ({
      property: issue.path.join('.'),
      message: i18n?.t(issue.message, { args: this.buildArgs(issue) }) ?? issue.message,
    }));

    throw new BadRequestException(message);
  }

  private buildArgs(issue: z.core.$ZodIssue) {
    if (issue.code === ZodIssueCode.too_small) {
      return { min: issue.minimum };
    }
    if (issue.code === ZodIssueCode.too_big) {
      return { max: issue.maximum };
    }
    return undefined;
  }
}
