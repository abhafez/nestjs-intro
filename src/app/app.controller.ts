import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Health-check greeting' })
  @ApiResponse({ status: 200, description: 'Greeting returned' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
