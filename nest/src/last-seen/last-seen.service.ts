// src/last-seen/last-seen.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LastSeenService {
  constructor(private prisma: PrismaService) {}

  async getAllLastSeen() {
    return this.prisma.lastSeen.findMany();
 // فرض بر این است که جدول last_seen در دیتابیس وجود دارد
  }
}
