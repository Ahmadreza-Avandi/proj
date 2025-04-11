import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'nationalCode', // نام فیلد ورودی برای کد ملی
      passwordField: 'password', // نام فیلد ورودی برای رمز عبور
    });
  }

  async validate(nationalCode: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(nationalCode, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
