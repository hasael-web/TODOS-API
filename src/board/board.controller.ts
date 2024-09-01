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
import { BoardService } from './board.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateBoardDto, UpdateBoardDto } from './dto/create.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Board')
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @UseGuards(AuthGuard)
  @Get('/')
  async getBoards(@Request() req): Promise<any> {
    try {
      const boards = await this.boardService.getBoards(req.user.id);
      return boards;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  @Get('/:id')
  async getBoard(@Param('id') id): Promise<any> {
    try {
      const board = await this.boardService.getBoard(id);
      return board;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }
  @UseGuards(AuthGuard)
  @Post('/')
  async createBoard(
    @Body() data: CreateBoardDto,
    @Request() req,
  ): Promise<any> {
    try {
      const board = await this.boardService.createBoard(data, req.user.id);
      return board;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  async updateBoard(
    @Body() data: UpdateBoardDto,
    @Param('id') id,
  ): Promise<any> {
    try {
      const board = await this.boardService.updateBoard(id, data);
      return board;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async deleteBoard(@Param('id') id): Promise<any> {
    try {
      const board = await this.boardService.deleteBoard(id);
      return board;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }
}
