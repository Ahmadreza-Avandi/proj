import { PrismaService } from '../prisma.service';
export declare class LastSeenService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllLastSeen(): Promise<{
        id: number;
        fullName: string;
        nationalCode: string;
        checkinTime: Date;
    }[]>;
}
