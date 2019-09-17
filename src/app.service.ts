import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getPong(): { msg: string } {
    return { msg: 'pong' };
  }
}
