import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './providers/app.service';

/** Root controller exposing the application health-check route. */
@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  //#region GET /
  /** Returns a static greeting used as a health check. */
  @ApiOperation({
    summary: 'Health-check greeting',
    description: 'Returns a fixed string. Useful as a liveness probe - it touches no database and no other service.',
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
