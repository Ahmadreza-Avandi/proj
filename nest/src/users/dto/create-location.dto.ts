import { IsString } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  title: string;

  @IsString()
  representative: string;

  @IsString()
  grade: string;

  @IsString()
  major: string;
}