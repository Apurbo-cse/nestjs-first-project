/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // Simulating a user lookup (you can replace this with actual DB logic)
  private readonly users = [
    {
      id: 1,
      username: 'john',
      password: '$2b$10$kP/pR4lPIUpzJfE2W3UGYey.Y.7Xp1HkpDpZb8ePfZ8xOS7nhH7Fe' // bcrypt hashed password
    },
  ];

  // Validate user credentials
  async validateUser(username: string, password: string): Promise<any> {
    const user = this.users.find((user) => user.username === username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result; // return user data excluding password
    }
    return null;
  }

  // Generate a JWT token
  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
