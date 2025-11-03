// import { User } from './user.entity';

import { Expose } from 'class-transformer';

export class AdminResponse {
  constructor(private readonly partial?: Partial<AdminResponse>) {
    Object.assign(this, partial);
  }

  @Expose()
  message: string;
  // user: User;
}
