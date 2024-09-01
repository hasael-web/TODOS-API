import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateTaskDto, UpdateTaskDto } from './dto/create.dto';

@Injectable()
export class TaskService {
  constructor(private readonly prismaService: PrismaService) {}

  async getTask(id: string): Promise<any> {
    try {
      const task = await this.prismaService.task.findUnique({
        where: {
          id,
        },
      });

      if (!task) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Task not found',
        };
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Task fetched successfully',
        data: task,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }

  async getTasks(): Promise<any> {
    try {
      const tasks = await this.prismaService.task.findMany();

      return {
        statusCode: HttpStatus.OK,
        message: 'Tasks fetched successfully',
        data: tasks,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }

  async createTask(data: CreateTaskDto): Promise<any> {
    try {
      const task = await this.prismaService.task.create({
        data,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Task created successfully',
        data: task,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }

  async updateTask(id: string, data: UpdateTaskDto): Promise<any> {
    try {
      const payload: Partial<UpdateTaskDto> = {};

      Object.keys(data).map((key) => {
        if (data[key]) {
          payload[key] = data[key];
        }
      });

      const task = await this.prismaService.task.update({
        where: {
          id,
        },
        data: payload,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Task updated successfully',
        data: task,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }

  async moveTask(id: string, boardId: string): Promise<any> {
    try {
      const task = await this.prismaService.task.update({
        where: {
          id,
        },
        data: {
          board_id: boardId,
        },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Task moved successfully',
        data: task,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }

  async deleteTask(id: string): Promise<any> {
    try {
      await this.prismaService.task.delete({
        where: {
          id,
        },
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Task deleted successfully',
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }
}
