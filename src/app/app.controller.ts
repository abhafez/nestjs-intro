import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../auth/decorators/api-auth.decorator';
import { AppService } from './providers/app.service';

/** Root controller exposing the application health-check route. */
@ApiTags('App')
@ApiAuth()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  //#region GET /
  /** Returns a static greeting used as a health check. */
  @ApiOperation({
    summary: 'Health-check greeting',
    description:
      'Returns a fixed string. It touches no database and no other service, but it is **not** anonymous: ' +
      'the global `AuthenticationGuard` protects it like any other route, so a liveness probe has to send a ' +
      'valid access token. Add `@Auth(AuthType.None)` to make it a true unauthenticated health check.',
  })
  @ApiOkResponse({
    description: 'The greeting, as a plain-text body.',
    schema: { type: 'string', example: 'Hello World!' },
  })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  //#endregion
}
