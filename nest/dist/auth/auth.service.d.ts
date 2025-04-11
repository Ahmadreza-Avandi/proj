import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private userService;
    private jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    validateUser(nationalCode: string, password: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
    }>;
}
