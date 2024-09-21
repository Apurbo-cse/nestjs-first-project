/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(), // Mock the JwtService sign method
          },
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data when username and password are valid', async () => {
      // Arrange
      const username = 'john';
      const password = 'valid_password';
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = { id: 1, username, password: hashedPassword };
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      (authService as any).users = [user]; // Injecting mock user data

      // Act
      const result = await authService.validateUser(username, password);

      // Assert
      expect(result).toEqual({ id: 1, username });
    });

    it('should return null if the password is incorrect', async () => {
      // Arrange
      const username = 'john';
      const password = 'valid_password';
      const incorrectPassword = 'wrong_password';
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = { id: 1, username, password: hashedPassword };
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
      (authService as any).users = [user]; // Injecting mock user data

      // Act
      const result = await authService.validateUser(username, incorrectPassword);

      // Assert
      expect(result).toBeNull();
    });

    it('should return null if the username is not found', async () => {
      // Arrange
      const username = 'nonexistent_user';
      const password = 'any_password';
      (authService as any).users = []; // Empty user array

      // Act
      const result = await authService.validateUser(username, password);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should generate a valid JWT token', async () => {
      // Arrange
      const user = { id: 1, username: 'john' };
      const token = 'valid_token';
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      // Act
      const result = await authService.login(user);

      // Assert
      expect(jwtService.sign).toHaveBeenCalledWith({ username: user.username, sub: user.id });
      expect(result).toEqual({ access_token: token });
    });
  });
});
