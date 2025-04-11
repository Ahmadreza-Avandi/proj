import { IsString, IsOptional } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  permissions?: Record<string, boolean> | string; // اگر مجوزها قابل تغییر هستند
}
