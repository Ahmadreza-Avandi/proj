import { IsEnum } from 'class-validator';

// تعریف Enum
export enum RoleEnum {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export class UpdateUserRoleDto {
  @IsEnum(RoleEnum) // استفاده از RoleEnum برای اعتبارسنجی
  role: RoleEnum;
}
