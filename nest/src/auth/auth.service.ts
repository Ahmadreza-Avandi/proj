import { Injectable } from '@nestjs/common';
import { UserService } from '../users/users.service'; // تغییر UsersService به UserService
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService, // تغییر UsersService به UserService
    private jwtService: JwtService,
  ) {}

  async validateUser(nationalCode: string, password: string): Promise<any> {
    const user = await this.userService.findByNationalCode(nationalCode); // تغییر UsersService به UserService
    if (user && bcrypt.compareSync(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { nationalCode: user.nationalCode, role: user.role }; // اطمینان از وجود نقش کاربر
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
