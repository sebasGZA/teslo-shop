import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Product } from '../../products/entities';
import { ApiProperty } from '@nestjs/swagger';
import { UserEnum } from '../enums';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  @ApiProperty({
    example: UserEnum.EMAIL_EXAMPLE,
    description: UserEnum.EMAIL_DESCRIPTION,
    uniqueItems: true,
  })
  email: string;

  @Column('text')
  @ApiProperty({
    example: UserEnum.PASSWORD_EXAMPLE,
    description: UserEnum.PASSWORD_DESCRIPTION,
  })
  password: string;

  @Column('text')
  @ApiProperty({
    example: UserEnum.FULL_NAME_EXAMPLE,
    description: UserEnum.FULL_NAME_DESCRIPTION,
  })
  fullName: string;

  @Column('bool', {
    default: true,
  })
  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles: string[];

  @OneToMany(() => Product, (product) => product.user, {})
  products?: Product[];

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }
}
