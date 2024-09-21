/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(), // Mocking the AuthService methods
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token when credentials are valid', async () => {
      // Arrange
      const loginDto = { username: 'john', password: 'valid_password' };
      const user = { id: 1, username: 'john' };
      const token = { access_token: 'valid_token' };

      // Mock the validateUser and login functions
      jest.spyOn(authService, 'validateUser').mockResolvedValue(user);
      jest.spyOn(authService, 'login').mockResolvedValue(token);

      // Act
      const result = await authController.login(loginDto);

      // Assert
      expect(authService.validateUser).toHaveBeenCalledWith('john', 'valid_password');
      expect(authService.login).toHaveBeenCalledWith(user);
      expect(result).toEqual(token);
    });

    it('should return an error message when credentials are invalid', async () => {
      // Arrange
      const loginDto = { username: 'john', password: 'wrong_password' };

      // Mock the validateUser function to return null (invalid credentials)
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      // Act
      const result = await authController.login(loginDto);

      // Assert
      expect(authService.validateUser).toHaveBeenCalledWith('john', 'wrong_password');
      expect(result).toEqual({ message: 'Invalid credentials' });
    });
  });
});
