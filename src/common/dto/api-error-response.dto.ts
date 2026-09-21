import { ApiProperty } from '@nestjs/swagger';

/** Body returned by every non-validation error raised through an `HttpException`. */
export class ApiErrorResponseDto {
  /** Mirror of the HTTP status code. */
  @ApiProperty({ description: 'Mirror of the HTTP status code.', example: 404 })
  statusCode: number;

  /** Human-readable explanation of what went wrong. */
  @ApiProperty({
    description: 'Human-readable explanation of what went wrong.',
    example: 'User with email user@example.com was not found.',
  })
  message: string;

  /** Short name of the status, e.g. `Not Found`. */
  @ApiProperty({ description: 'Short name of the status.', example: 'Not Found' })
  error: string;
}
