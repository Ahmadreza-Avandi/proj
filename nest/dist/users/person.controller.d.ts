import { PersonService } from './person.service';
export declare class PersonController {
    private readonly personService;
    constructor(personService: PersonService);
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
