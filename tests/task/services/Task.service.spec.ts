import { UserService } from './../../../src/modules/users/services/User.service';
import { IUserRepository } from './../../../src/modules/users/repositories/IUser.repository';
import { AppError } from '../../../src/shared/middlewares/error.handler';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const mockUserRepository: jest.Mocked<IUserRepository> = {
  create: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn(),
  findByIdWithPassword: jest.fn(),
  update: jest.fn(),
  updatePassword: jest.fn(),
  delete: jest.fn(),
};

const userService = new UserService(mockUserRepository);

describe("UserService", () => {
  describe("create", () => {
    it("deve criar um novo usuário com sucesso", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed_password");
      mockUserRepository.create.mockResolvedValue({
        id: "1",
        ...userData,
        created_at: new Date().toISOString(),
      });

      const user = await userService.create(userData);

      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...userData,
        password: "hashed_password",
      });
    });

    it("deve lançar um erro se o e-mail já estiver em uso", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      mockUserRepository.findByEmail.mockResolvedValue({
        id: "1",
        ...userData,
        created_at: new Date().toISOString(),
      });

      await expect(userService.create(userData)).rejects.toThrow(
        new AppError("Este e-mail já está em uso.", 409)
      );
    });
  });
  describe("login", () => {
    it("deve autenticar o usuário e retornar um token", async () => {
      const loginData = { email: "test@example.com", password: "password123" };
      const userFromDb = {
        id: "1",
        name: "Test User",
        email: loginData.email,
        password: "hashed_password",
        created_at: "",
      };

      mockUserRepository.findByEmail.mockResolvedValue(userFromDb);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("fake_jwt_token");

      const result = await userService.login(loginData);

      expect(result.token).toBe("fake_jwt_token");
      expect(result.user["password"]).toBeUndefined();
    });

    it("deve lançar um erro para credenciais inválidas (usuário não encontrado)", async () => {
      const loginData = { email: "test@example.com", password: "password123" };

      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(userService.login(loginData)).rejects.toThrow(
        new AppError("Credenciais inválidas.", 401)
      );
    });

    it("deve lançar um erro para credenciais inválidas (senha incorreta)", async () => {
      const loginData = {
        email: "test@example.com",
        password: "wrong_password",
      };
      const userFromDb = {
        id: "1",
        name: "Test User",
        email: loginData.email,
        password: "hashed_password",
        created_at: "",
      };

      mockUserRepository.findByEmail.mockResolvedValue(userFromDb);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(userService.login(loginData)).rejects.toThrow(
        new AppError("Credenciais inválidas.", 401)
      );
    });
  });
});
