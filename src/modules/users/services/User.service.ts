import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../../config/env";
import { AppError } from "../../../shared/middlewares/error.handler"; 
import { IUserRepository } from "../repositories/IUser.repository";
import { ChangePasswordDTO, CreateUserDTO, LoginUserDTO, UpdateUserDTO } from "../dtos/user.dto";

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  async create({ name, email, password }: CreateUserDTO) {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new AppError("Este e-mail já está em uso.", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }

  async login({ email, password }: LoginUserDTO) {
    const user = await this.userRepository.findByEmail(email);

    if (!user || !user.password) {
      throw new AppError("Credenciais inválidas.", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError("Credenciais inválidas.", 401);
    }

    const token = jwt.sign({ id: user.id, email: user.email }, env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    return user;
  }

  async update(userId: string, data: UpdateUserDTO) {
    const userExists = await this.userRepository.findById(userId);
    if (!userExists) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    if (data.email && data.email !== userExists.email) {
      const emailInUse = await this.userRepository.findByEmail(data.email);
      if (emailInUse) {
        throw new AppError("Este e-mail já está em uso.", 409);
      }
    }

    const updatedUser = await this.userRepository.update(userId, data);
    return updatedUser;
  }

  async changePassword(
    userId: string,
    { oldPassword, newPassword }: ChangePasswordDTO
  ) {
    const user = await this.userRepository.findByIdWithPassword(userId);
    if (!user || !user.password) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new AppError("A senha antiga está incorreta.", 401);
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await this.userRepository.updatePassword(userId, newPasswordHash);
  }

  async delete(userId: string) {
    const userExists = await this.userRepository.findById(userId);
    if (!userExists) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    await this.userRepository.delete(userId);
  }
}
