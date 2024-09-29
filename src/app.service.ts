import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  getHello(): string {
    this.logger.log('This is a log message', AppService.name); // Info level
    return 'Hello World!';
  }
}
