import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import moment from 'moment';

@ValidatorConstraint({ name: 'isValidDate', async: false })
export class IsValidDateConstraint implements ValidatorConstraintInterface {
  validate(dateStr: string, args: ValidationArguments) {
    const date = new Date(dateStr);
    return (
      !isNaN(date.getTime()) && dateStr === moment(date).format('YYYY-MM-DD') // Check if the string matches the formatted date
    );
  }

  defaultMessage(args: ValidationArguments) {
    return 'Date ($value) is not valid. Please use YYYY-MM-DD format and ensure the date is valid.';
  }
}

export class CreateBoardDto {
  @ApiProperty({
    type: String,
    description: 'title of the board',
    example: 'Group 1',
    required: true,
  })
  @IsNotEmpty({
    message: 'title is required',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: '2024-06-01',
    description: 'Start date of the board',
    type: String,
    required: true,
  })
  @Validate(IsValidDateConstraint)
  end_date: Date;

  @ApiProperty({
    example: '2024-06-20',
    description: 'End date of the board',
    type: String,
    required: true,
  })
  @Validate(IsValidDateConstraint)
  start_date: Date;
}

export class UpdateBoardDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @ApiProperty({
    example: '2024-06-09',
    description: 'Start date of the board',
    type: String,
  })
  @IsOptional()
  @Validate(IsValidDateConstraint)
  end_date?: Date;

  @IsOptional()
  @Validate(IsValidDateConstraint)
  start_date?: Date;
}
