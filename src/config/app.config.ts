import { registerAs } from '@nestjs/config';

export interface AppConfig {
  messagePrefix: string;
}

export default registerAs<AppConfig>('app', () => ({
  messagePrefix: process.env.APP_MESSAGE_PREFIX ?? 'Something is wrong',
}));
