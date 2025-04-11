import { Module } from '@nestjs/common';
import { UserService } from './users.service'; // تغییر UsersService به UserService
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [UserService, PrismaService], // تغییر UsersService به UserService
  controllers: [UsersController],
  exports: [UserService], // تغییر UsersService به UserService
})
export class UsersModule {}
