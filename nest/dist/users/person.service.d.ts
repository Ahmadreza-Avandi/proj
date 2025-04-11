import { PrismaService } from '../prisma.service';
export declare class PersonService {
    private prisma;
    constructor(prisma: PrismaService);
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
}
