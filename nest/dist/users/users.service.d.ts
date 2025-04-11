import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleEnum } from './users.controller';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        id: number;
        fullName: string;
        nationalCode: string;
        phoneNumber: string;
        password: string;
        roleId: number;
        majorId: number | null;
        gradeId: number | null;
        classId: number | null;
    }>;
    findAll(): Promise<({
        role: {
            name: string;
            permissions: import("@prisma/client/runtime/library").JsonValue;
            id: number;
        };
    } & {
        id: number;
        fullName: string;
        nationalCode: string;
        phoneNumber: string;
        password: string;
        roleId: number;
        majorId: number | null;
        gradeId: number | null;
        classId: number | null;
    })[]>;
    findOne(id: number): Promise<{
        role: {
            name: string;
            permissions: import("@prisma/client/runtime/library").JsonValue;
            id: number;
        };
    } & {
        id: number;
        fullName: string;
        nationalCode: string;
        phoneNumber: string;
        password: string;
        roleId: number;
        majorId: number | null;
        gradeId: number | null;
        classId: number | null;
    }>;
    findByNationalCode(nationalCode: string): Promise<{
        role: {
            name: string;
            permissions: import("@prisma/client/runtime/library").JsonValue;
            id: number;
        };
    } & {
        id: number;
        fullName: string;
        nationalCode: string;
        phoneNumber: string;
        password: string;
        roleId: number;
        majorId: number | null;
        gradeId: number | null;
        classId: number | null;
    }>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<{
        id: number;
        fullName: string;
        nationalCode: string;
        phoneNumber: string;
        password: string;
        roleId: number;
        majorId: number | null;
        gradeId: number | null;
        classId: number | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        fullName: string;
        nationalCode: string;
        phoneNumber: string;
        password: string;
        roleId: number;
        majorId: number | null;
        gradeId: number | null;
        classId: number | null;
    }>;
    updateRole(id: number, roleId: number): Promise<{
        id: number;
        fullName: string;
        nationalCode: string;
        phoneNumber: string;
        password: string;
        roleId: number;
        majorId: number | null;
        gradeId: number | null;
        classId: number | null;
    }>;
    getRoleIdByName(roleName: RoleEnum): Promise<number>;
}
