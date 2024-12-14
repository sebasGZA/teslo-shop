import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { UserEnum } from '../enums';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: UserEnum.EMAIL_EXAMPLE,
    description: UserEnum.EMAIL_DESCRIPTION,
  })
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: UserEnum.MATCH_PASSWORD_MESSAGE,
  })
  @ApiProperty({
    example: UserEnum.PASSWORD_EXAMPLE,
    description: UserEnum.PASSWORD_DESCRIPTION,
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: UserEnum.FULL_NAME_EXAMPLE,
    description: UserEnum.FULL_NAME_DESCRIPTION,
  })
  fullName: string;
}
