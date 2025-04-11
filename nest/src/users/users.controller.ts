import { Body, Controller, Delete, Param, Post, Get, Put } from '@nestjs/common';
import { UserService } from './users.service';
import { User } from '@prisma/client';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

export enum RoleEnum {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Post('add-user')
  async addUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async getUser(@Param('id') userId: string): Promise<User> {
    return this.usersService.findOne(parseInt(userId, 10));
  }

  @Get('by-national-code/:nationalCode')
  async getUserByNationalCode(@Param('nationalCode') nationalCode: string): Promise<User> {
    return this.usersService.findByNationalCode(nationalCode);
  }

  @Put(':id/role')
  async updateUserRole(@Param('id') userId: string, @Body() data: UpdateUserRoleDto): Promise<User> {
    const roleId = await this.usersService.getRoleIdByName(data.role);
    return this.usersService.updateRole(parseInt(userId, 10), roleId);
  }

  @Delete(':id')
  async deleteUser(@Param('id') userId: string): Promise<User> {
    return this.usersService.remove(parseInt(userId, 10));
  }

  @Put(':id')
  async updateUser(@Param('id') userId: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.update(parseInt(userId, 10), updateUserDto);
  }
}
