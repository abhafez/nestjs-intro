import { ApiProperty } from '@nestjs/swagger';

/** One field's translated validation failures. */
export class FieldErrorDto {
  /** Dot-path of the invalid field, e.g. `metaOptions.metaValue`. */
  @ApiProperty({ description: 'Dot-path of the invalid field.', example: 'email' })
  field: string;

  /** Translated messages describing why the field was rejected. */
  @ApiProperty({
    description: 'Translated messages describing why the field was rejected.',
    example: ['Email must be a valid email address'],
    type: [String],
  })
  messages: string[];
}

/**
 * Body returned when the global `ValidationPipe` rejects a request.
 *
 * Messages are translated through `nestjs-i18n`, so they follow the request's `Accept-Language`.
 */
export class ValidationErrorResponseDto {
  /** Always `400`. */
  @ApiProperty({ description: 'Always 400.', example: 400 })
  statusCode: number;

  /** One entry per invalid field, flattened from nested DTOs. */
  @ApiProperty({ description: 'One entry per invalid field, flattened from nested DTOs.', type: [FieldErrorDto] })
  message: FieldErrorDto[];

  /** Always `Bad Request`. */
  @ApiProperty({ description: 'Always Bad Request.', example: 'Bad Request' })
  error: string;
}
