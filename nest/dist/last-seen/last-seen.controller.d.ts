import { LastSeenService } from './last-seen.service';
export declare class LastSeenController {
    private readonly lastSeenService;
    constructor(lastSeenService: LastSeenService);
    getAllLastSeen(): Promise<{
        id: number;
        fullName: string;
        nationalCode: string;
        checkinTime: Date;
    }[]>;
}
