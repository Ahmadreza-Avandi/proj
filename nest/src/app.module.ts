// src/app.module.ts

import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RoleController } from './users/role.controller';
import { RoleService } from './users/role.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LocationsModule } from './users/locations.module';
import { LastSeenModule } from './last-seen/last-seen.module'; // ماژول جدید اضافه شده

@Module({
  imports: [
    UsersModule,
    AuthModule,
    LocationsModule,
    LastSeenModule, // اضافه کردن ماژول LastSeen
  ],
  controllers: [RoleController],
  providers: [RoleService, PrismaService],
  exports: [RoleService],
})
export class AppModule {}
