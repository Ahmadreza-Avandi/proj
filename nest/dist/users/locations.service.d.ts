import { PrismaService } from '../prisma.service';
import { Location } from '@prisma/client';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
export declare class LocationsService {
    private prisma;
    constructor(prisma: PrismaService);
    createLocation(data: CreateLocationDto): Promise<Location>;
    getLocations(): Promise<Location[]>;
    updateLocation(id: number, data: UpdateLocationDto): Promise<Location>;
    deleteLocation(id: number): Promise<Location>;
}
