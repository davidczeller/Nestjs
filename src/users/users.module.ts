import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { TypedConfigService } from 'src/config/typed-config.service';
import { AuthConfig } from 'src/config/auth.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PasswordService } from './password/password.service';
import { UserService } from './user/user.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      // In order to make this work we need to make the TypedConfigService @Injectable
      // inject: [authConfig.KEY],
      // useFactory: (auth: ConfigType<typeof authConfig>) => ({
      //   secret: auth.jwt.secret,
      //   signOptions: {
      //     expiresIn: auth.jwt.expiresIn,
      //   },
      //
      // useFactory: (configService: TypedConfigService) => ({
      //   secret: configService.get<AuthConfig>('auth').jwt.secret,
      //   signOptions: {
      //     expiresIn: configService.get<AuthConfig>('auth').jwt.expiresIn,
      //   },
      // }),
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: TypedConfigService) => ({
        secret: config.get<AuthConfig>('auth').jwt.secret,
        signOptions: {
          expiresIn: config.get<AuthConfig>('auth').jwt.expiresIn,
        },
      }),
    }),
  ],
  providers: [PasswordService, UserService, AuthService, AuthGuard],
  controllers: [AuthController],
})
export class UsersModule {}
