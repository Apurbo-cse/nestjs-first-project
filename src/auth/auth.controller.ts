/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { username: string, password: string }) {
    const user = await this.authService.validateUser(body.username, body.password);
    if (!user) {
      return { message: 'Invalid credentials' }; // Handle error gracefully
    }
    return this.authService.login(user);
  }

  // An example route protected by JWT
  @UseGuards(JwtAuthGuard)
  @Post('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
