import { ApiProperty } from '@nestjs/swagger';

/** Body of an endpoint that confirms an action instead of echoing the affected row. */
export class MessageResponseDto {
  /**
   * Translated confirmation, resolved from the request's `Accept-Language` header.
   */
  @ApiProperty({
    description: "Translated confirmation, resolved from the request's Accept-Language header.",
    example: 'User created successfully.',
  })
  message: string;
}
