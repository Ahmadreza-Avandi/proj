import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('users/role') // تغییر مسیر برای ایجاد انسجام بیشتر
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  // متد برای ایجاد نقش جدید
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    return await this.roleService.create(createRoleDto);
  }

  // متد برای دریافت تمام نقش‌ها
  @Get()
  async findAll() {
    return await this.roleService.findAll();
  }

  // متد برای دریافت یک نقش خاص با استفاده از شناسه آن
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.roleService.findOne(+id);
  }

  // متد برای به‌روزرسانی یک نقش با استفاده از شناسه آن
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return await this.roleService.update(+id, updateRoleDto);
  }

  // متد برای حذف یک نقش با استفاده از شناسه آن
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.roleService.remove(+id);
  }
}
