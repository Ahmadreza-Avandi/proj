import { Controller, Get, Post, Body, UseGuards, Request, Res } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('validate-token')
  validateToken(@Request() req: any, @Res() res: Response) {
    return res.json({ valid: true, user: req.user });
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any, @Res() res: Response) {
    const user = req.user;
    const result = await this.authService.login(user);
    return res.json(result);
  }
}
