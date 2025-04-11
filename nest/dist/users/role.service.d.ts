import { PrismaService } from '../prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
export declare class RoleService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createRoleDto: CreateRoleDto): Promise<{
        name: string;
        permissions: import("@prisma/client/runtime/library").JsonValue;
        id: number;
    }>;
    findAll(): Promise<{
        name: string;
        permissions: import("@prisma/client/runtime/library").JsonValue;
        id: number;
    }[]>;
    findOne(id: number): Promise<{
        name: string;
        permissions: import("@prisma/client/runtime/library").JsonValue;
        id: number;
    }>;
    update(id: number, updateRoleDto: UpdateRoleDto): Promise<{
        name: string;
        permissions: import("@prisma/client/runtime/library").JsonValue;
        id: number;
    }>;
    remove(id: number): Promise<{
        name: string;
        permissions: import("@prisma/client/runtime/library").JsonValue;
        id: number;
    }>;
}
