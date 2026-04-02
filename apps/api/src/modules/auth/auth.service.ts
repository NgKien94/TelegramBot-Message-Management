import { PrismaService } from '@message-management/db';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { hash, verify } from 'argon2';
import { StringValue } from 'ms';
import { TokenPayload } from '@message-management/types';
import { RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
  private access_token_secret: string;
  private access_token_expires_in: string;
  private refresh_token_secret: string;
  private refresh_token_expires_in: string;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.access_token_secret = this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET');
    this.access_token_expires_in = this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES_IN');
    this.refresh_token_secret = this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET');
    this.refresh_token_expires_in = this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN');
  }

  async getMe(accountId: string) {
    const user = await this.prismaService.account.findUnique({
      where: {
        id: accountId
      },
      omit: {
        password: true
      }
    })

    if(!user) {
      throw new NotFoundException('User not found');
    }
    return user
  }

  async login(email: string, password: string) {
    const account = await this.prismaService.account.findUnique({
      where: {
        email,
      },
    });

    if (!account) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    const isMatch = await verify(account.password, password);
    if (!isMatch) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    const tokenPayload: TokenPayload = {
      accountId: account.id,
    };

    const access_token = this.jwtService.sign(tokenPayload, {
      secret: this.access_token_secret,
      expiresIn: this.access_token_expires_in as StringValue,
    });

    const refresh_token = this.jwtService.sign(tokenPayload, {
      secret: this.refresh_token_secret,
      expiresIn: this.refresh_token_expires_in as StringValue,
    });
    // save refresh_token into Database
    await this.prismaService.authToken.create({
      data: {
        refresh_token,
        accountId: account.id,
      },
    });

    return {
      id: account.id,
      access_token,
      refresh_token,
    };
  }

  async register(payload: RegisterDto) {
    const isExistEmail = await this.prismaService.account.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (isExistEmail) {
      throw new BadRequestException('Email has already exist');
    }

    const hashedPassword = await hash(payload.password);

    const account = await this.prismaService.account.create({
      data: {
        email: payload.email,
        name: payload.name,
        password: hashedPassword,
      },
    });

    const tokenPayload: TokenPayload = {
      accountId: account.id,
    };

    const access_token = this.jwtService.sign(tokenPayload, {
      secret: this.access_token_secret,
      expiresIn: this.access_token_expires_in as StringValue,
    });

    const refresh_token = this.jwtService.sign(tokenPayload, {
      secret: this.refresh_token_secret,
      expiresIn: this.refresh_token_expires_in as StringValue,
    });

    // save refresh_token into Database
    await this.prismaService.authToken.create({
      data: {
        refresh_token,
        accountId: account.id,
      },
    });

    return {
      id: account.id,
      access_token,
      refresh_token,
    };
  }

  async logout(token: string) {
    const { accountId } = this.jwtService.decode<TokenPayload>(token);

    await this.prismaService.authToken.deleteMany({
      where: {
        accountId,
        refresh_token: token,
      },
    });
  }

  async refreshToken(refresh_token: string) {

    try {
      const payload = this.jwtService.verify<TokenPayload>(refresh_token, {
        secret: this.refresh_token_secret,
      });

      const { accountId } = payload;
      const isExistToken = await this.prismaService.authToken.findFirst({
        where: {
          accountId,
          refresh_token,
        },
      });

      if (!isExistToken) {
        throw new NotFoundException('Token not found');
      }

      const account = await this.prismaService.account.findUnique({
        where: {
          id: accountId,
        },
      });

      if (!account) {
        throw new NotFoundException('User not found or deleted account');
      }

      const tokenPayload: TokenPayload = {
        accountId: account.id,
      };

      const access_token = this.jwtService.sign(tokenPayload, {
        secret: this.access_token_secret,
        expiresIn: this.access_token_expires_in as StringValue,
      });

      return {
        access_token,
      };
    } catch (error) {
      console.log('Refresh token error: ', error);
      throw new UnauthorizedException('Token is not valid');
    }
  }
}
