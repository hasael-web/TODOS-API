import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateBoardDto, UpdateBoardDto } from './dto/create.dto';
import moment from 'moment';

@Injectable()
export class BoardService {
  constructor(private readonly prismaService: PrismaService) {}
  formatToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  async getBoards(user_id: string): Promise<any> {
    const boards = await this.prismaService.board.findMany({
      where: {
        user_id,
      },
      include: {
        task: true,
      },
    });

    const result = boards.map((bd) => ({
      ...bd,
      start_date: this.formatToYYYYMMDD(new Date(bd.start_date)),
      end_date: this.formatToYYYYMMDD(new Date(bd.end_date)),
    }));

    return result;
  }

  async getBoard(id: string): Promise<any> {
    const board = await this.prismaService.board.findUnique({
      where: {
        id,
      },
    });

    if (!board) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Board not found',
      };
    }

    const result = {
      ...board,
      start_date: moment(board.start_date).format('YYYY-MM-DD'),
      end_date: moment(board.end_date).format('YYYY-MM-DD'),
    };

    return result;
  }

  async createBoard(data: CreateBoardDto, user_id: string): Promise<any> {
    try {
      const board = await this.prismaService.board.create({
        data: {
          title: data.title,
          start_date: new Date(data.start_date),
          end_date: new Date(data.start_date),
          user_id: user_id,
        },
      });

      const result = {
        ...board,
        start_date: moment(board.start_date).format('YYYY-MM-DD'),
        end_date: moment(board.end_date).format('YYYY-MM-DD'),
      };

      return {
        statusCode: HttpStatus.OK,
        message: 'Board created successfully',
        data: result,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }

  async updateBoard(id: string, data: UpdateBoardDto): Promise<any> {
    try {
      const payload: UpdateBoardDto = {};

      Object.keys(data).map((key) => {
        if (data[key]) {
          if (key === 'start_date' || key === 'end_date') {
            payload[key] = new Date(data[key]);
          } else {
            payload[key] = data[key];
          }
        }
      });

      const board = await this.prismaService.board.update({
        where: {
          id,
        },
        data: payload,
      });

      const result = {
        ...board,
        start_date: moment(board.start_date).format('YYYY-MM-DD'),
        end_date: moment(board.end_date).format('YYYY-MM-DD'),
      };

      return {
        statusCode: HttpStatus.OK,
        message: 'Board updated successfully',
        data: result,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }
  async deleteBoard(id: string): Promise<any> {
    try {
      const findBoard = await this.prismaService.board.findUnique({
        where: {
          id,
        },
      });

      if (!findBoard) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Board not found',
        };
      }

      await this.prismaService.board.delete({
        where: {
          id,
        },
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Board deleted successfully',
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }
}
