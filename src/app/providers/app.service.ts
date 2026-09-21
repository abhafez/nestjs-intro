import { Injectable } from '@nestjs/common';

/** Provides the application's health-check greeting. */
@Injectable()
export class AppService {
  //#region getHello
  /** Returns a static greeting string. */
  getHello(): string {
    return 'Hello World!';
  }
  //#endregion
}
