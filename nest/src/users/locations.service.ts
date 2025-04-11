// src/users/locations.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Location } from '@prisma/client';
import { CreateLocationDto } from './dto/create-location.dto'; // وارد کردن DTO
import { UpdateLocationDto } from './dto/update-location.dto'; // وارد کردن DTO

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  // ایجاد مکان جدید
  async createLocation(data: CreateLocationDto): Promise<Location> {
    return this.prisma.location.create({
      data,
    });
  }

  // دریافت همه مکان‌ها
  async getLocations(): Promise<Location[]> {
    return this.prisma.location.findMany();
  }

  // به‌روزرسانی مکان
  async updateLocation(id: number, data: UpdateLocationDto): Promise<Location> {
    return this.prisma.location.update({
      where: { id },
      data,
    });
  }

  // حذف مکان
  async deleteLocation(id: number): Promise<Location> {
    return this.prisma.location.delete({
      where: { id },
    });
  }
}
