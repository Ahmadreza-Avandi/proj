import { UserService } from './users.service';
import { User } from '@prisma/client';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
export declare enum RoleEnum {
    ADMIN = "ADMIN",
    USER = "USER"
}
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UserService);
    addUser(createUserDto: CreateUserDto): Promise<User>;
    getAllUsers(): Promise<User[]>;
    getUser(userId: string): Promise<User>;
    getUserByNationalCode(nationalCode: string): Promise<User>;
    updateUserRole(userId: string, data: UpdateUserRoleDto): Promise<User>;
    deleteUser(userId: string): Promise<User>;
    updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User>;
}
