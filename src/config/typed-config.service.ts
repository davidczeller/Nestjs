import { ConfigService } from '@nestjs/config';
import type { ConfigType } from './config.types';
// import { Injectable } from '@nestjs/common';

// @Injectable() // This will make sure to inject the config service into the users.module
export class TypedConfigService extends ConfigService<ConfigType, true> {}
