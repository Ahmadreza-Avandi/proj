// src/last-seen/last-seen.module.ts

import { Module } from '@nestjs/common';
import { LastSeenService } from './last-seen.service';
import { LastSeenController } from './last-seen.controller';
import { PrismaService } from '../prisma.service'; // برای ارتباط با دیتابیس

@Module({
  controllers: [LastSeenController],
  providers: [LastSeenService, PrismaService],
})
export class LastSeenModule {}
