import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '@modules/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { User } from '@modules/users/entities/user.entity';
import { JwtPayload } from '@common/interfaces/jwt-payload.interface';
import { Permission } from '@common/enums/permission.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);

    const tokens = await this.getTokens(user);
    await this.usersService.updateRefreshToken(user.id, tokens.refresh_token);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async login(user: User) {
    const tokens = await this.getTokens(user);
    await this.usersService.updateRefreshToken(user.id, tokens.refresh_token);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
    return { message: 'Logged out successfully' };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findOne(userId);

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access denied');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Access denied');
    }

    const tokens = await this.getTokens(user);
    await this.usersService.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  private async getTokens(user: User) {
    const roles = user.roles?.map((role) => role.name) || [];
    const permissions: Permission[] = user.roles?.flatMap((role) => role.permissions || []) || [];

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: roles as any,
      permissions,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRATION'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION'),
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  private sanitizeUser(user: User) {
    const { password, refreshToken, ...result } = user;
    return result;
  }
}
