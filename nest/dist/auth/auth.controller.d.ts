import { AuthService } from './auth.service';
import { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    validateToken(req: any, res: Response): Response<any, Record<string, any>>;
    login(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
}
