import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateTaskDto, UpdateTaskDto } from './dto/create.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Task')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(AuthGuard)
  @Get('/')
  async getTasks(@Request() req) {
    try {
      return this.taskService.getTasks(req.user.id);
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  @Get('/:id')
  async getTask(@Param('id') id) {
    try {
      return this.taskService.getTask(id);
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  @UseGuards(AuthGuard)
  @Post('/')
  async createTask(@Body() data: CreateTaskDto) {
    try {
      return this.taskService.createTask(data);
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  async updateTask(
    @Body()
    data: UpdateTaskDto,
    @Param('id') id,
  ) {
    try {
      return this.taskService.updateTask(id, data);
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async deleteTask(@Param('id') id) {
    try {
      return this.taskService.deleteTask(id);
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  @UseGuards(AuthGuard)
  @Post('/move')
  async moveTask(@Body() data: { id: string; board_id: string }) {
    try {
      const taskMove = await this.taskService.moveTask(data.id, data.board_id);

      return taskMove;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }
}
