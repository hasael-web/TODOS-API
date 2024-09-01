import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Task 1',
    description: 'Name of the task',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 10,
    description: 'Progress percentage of the task',
    type: Number,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  progress_percentage: number;
  @IsNotEmpty()
  @ApiProperty({
    example: 'fa983ddb-f17a-445b-8cb6-292b6d25d90a',
    description: 'Id of the board',
    type: String,
    required: true,
  })
  @IsString()
  board_id: string;
}

export class UpdateTaskDto {
  @IsNotEmpty()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Progress percentage of the task',
    type: Number,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  progress_percentage?: number;
}
