import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

/** Root controller exposing the application health-check route. */
@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  //#region GET /
  /** Returns a static greeting used as a health check. */
  @ApiOperation({ summary: 'Health-check greeting' })
  @ApiResponse({ status: 200, description: 'Greeting returned' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  //#endregion
}
