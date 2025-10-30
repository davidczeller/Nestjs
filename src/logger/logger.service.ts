import { Injectable } from '@nestjs/common';
import { MessageFormatterService } from '../message-formatter/message-formatter.service';

@Injectable()
export class LoggerService {
  constructor(
    private readonly messageFormatterService: MessageFormatterService,
  ) {}

  log(message: string) {
    // return this.messageFormatterService.format(message);
    const formattedMessage = this.messageFormatterService.format(message);
    console.log(message);
    return formattedMessage;
  }
}
