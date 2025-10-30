import { Injectable } from '@nestjs/common';

@Injectable()
export class DummyService {
  public work() {
    return 'I am working!';
  }
}
