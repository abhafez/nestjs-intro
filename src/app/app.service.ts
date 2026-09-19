import { Injectable } from '@nestjs/common';

/** Provides the application's health-check greeting. */
@Injectable()
export class AppService {
  /** Returns a static greeting string. */
  getHello(): string {
    return 'Hello World!';
  }
}
