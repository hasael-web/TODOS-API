import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateUserDto } from 'src/users/dto/create.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { BlacklistService } from './blacklist';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly blacklistService: BlacklistService,
  ) {}

  async register(payload: CreateUserDto): Promise<any> {
    try {
      const salt = await bcrypt.genSalt();
      const hasPassword = await bcrypt.hash(payload.password, salt);
      const result = await this.userService.create({
        ...payload,
        password: hasPassword,
      });

      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  async login(payload: { email: string; password: string }): Promise<any> {
    try {
      const result = await this.prismaService.user.findFirst({
        where: {
          email: payload.email,
        },
      });

      if (!result) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid credentials',
        };
      }

      const isPasswordValid = await bcrypt.compare(
        payload.password,
        result.password,
      );

      if (!isPasswordValid) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid credentials',
        };
      }

      const token = await this.jwtService.signAsync({
        email: result.email,
        id: result.id,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Login successful',
        token,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }

  async logout(token: string): Promise<void> {
    const decoded = this.jwtService.decode(token) as any;
    const expiresAt = decoded?.exp; // Token's expiry time
    if (expiresAt) {
      this.blacklistService.add(token, expiresAt);
    }
  }
}
