import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    // @Inject(CACHE_MANAGER) private readonly cahcehManager: Cache,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<any> {
    try {
      const user = await this.prismaService.user.findFirst({
        where: {
          email: createUserDto.email,
        },
      });

      if (user) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'User already exists',
          data: null,
        };
      }

      const result = await this.prismaService.user.create({
        data: createUserDto,
      });

      const response = {
        statusCode: HttpStatus.OK,
        message: 'User created successfully',
        data: result,
      };
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
