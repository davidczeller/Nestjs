import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../create-user.dto';
import { User } from '../user.entity';
import { PasswordService } from '../password/password.service';

// 1) User registration
//    => Make sure user doesn't exist
//    => Store the user
//    => (optional) Generate JWT token
// 2) Generating JWT token

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
  ) {}

  public async register(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userService.findByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = await this.userService.createUser(createUserDto);

    // 1) Return the user
    // OR
    // 2) Return user & JWT token
    // OR
    // 3) Return token only

    return user;
  }

  public async login(email: string, password: string): Promise<string> {
    const user = await this.userService.findByEmail(email);

    // 1) User doesn't exist
    // 2) User exists but password is incorrect

    if (
      !user ||
      !(await this.passwordService.verify(password, user.password)) // password is incorrect
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user);
  }

  private generateToken(user: User) {
    const payload = {
      sub: user.id,
      name: user.name,
      roles: user.roles,
    };
    return this.jwtService.sign(payload);
  }
}
