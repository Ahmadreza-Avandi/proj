import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
export declare class RoleController {
    private readonly roleService;
    constructor(roleService: RoleService);
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
    findOne(id: string): Promise<{
        name: string;
        permissions: import("@prisma/client/runtime/library").JsonValue;
        id: number;
    }>;
    update(id: string, updateRoleDto: UpdateRoleDto): Promise<{
        name: string;
        permissions: import("@prisma/client/runtime/library").JsonValue;
        id: number;
    }>;
    remove(id: string): Promise<{
        name: string;
        permissions: import("@prisma/client/runtime/library").JsonValue;
        id: number;
    }>;
}
