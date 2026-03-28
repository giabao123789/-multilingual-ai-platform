import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      service: 'multilingual-ai-platform-api',
      timestamp: new Date().toISOString(),
    };
  }
}
