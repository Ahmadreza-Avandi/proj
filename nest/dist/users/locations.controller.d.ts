import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
export declare class LocationsController {
    private readonly locationsService;
    constructor(locationsService: LocationsService);
    create(data: CreateLocationDto): Promise<{
        major: string;
        grade: string;
        id: number;
        title: string;
        representative: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        major: string;
        grade: string;
        id: number;
        title: string;
        representative: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    update(id: string, data: UpdateLocationDto): Promise<{
        major: string;
        grade: string;
        id: number;
        title: string;
        representative: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(id: string): Promise<{
        major: string;
        grade: string;
        id: number;
        title: string;
        representative: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
