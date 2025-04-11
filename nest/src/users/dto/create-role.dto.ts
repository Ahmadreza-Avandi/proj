import { IsNotEmpty, IsString, IsJSON } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsJSON() // اعتبارسنجی برای JSON
  permissions: Record<string, any>; // نوع را به Record تغییر دادیم
}

