import { IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  @ApiProperty({
    default: 10,
    description: 'How many rows do you need?',
  })
  limit?: number;

  @IsOptional()
  @Min(0)
  @Type(() => Number)
  @ApiProperty({
    default: 0,
    description: 'How many rows do you want to skip?',
  })
  offset?: number;
}
