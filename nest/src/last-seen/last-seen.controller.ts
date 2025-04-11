// src/last-seen/last-seen.controller.ts

import { Controller, Get } from '@nestjs/common';
import { LastSeenService } from './last-seen.service';

@Controller('last_seen')
export class LastSeenController {
  constructor(private readonly lastSeenService: LastSeenService) {}

  @Get()
  async getAllLastSeen() {
    return this.lastSeenService.getAllLastSeen();
  }
}
