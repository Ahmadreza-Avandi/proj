// src/users/locations.controller.ts

import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto'; // وارد کردن DTO
import { UpdateLocationDto } from './dto/update-location.dto'; // وارد کردن DTO

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  // ایجاد مکان جدید
  @Post()
  async create(@Body() data: CreateLocationDto) {
    return this.locationsService.createLocation(data);
  }

  // دریافت همه مکان‌ها
  @Get()
  async findAll() {
    return this.locationsService.getLocations();
  }

  // به‌روزرسانی مکان
  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateLocationDto) {
    return this.locationsService.updateLocation(Number(id), data);
  }

  // حذف مکان
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.locationsService.deleteLocation(Number(id));
  }
}
