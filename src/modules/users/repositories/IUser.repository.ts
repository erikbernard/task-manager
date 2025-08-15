import { User } from "../entities/User";
import { CreateUserDTO, UpdateUserDTO } from "../dtos/user.dto";

export interface IUserRepository {
  create(data: CreateUserDTO): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByIdWithPassword(id: string): Promise<User | null>;
  update(id: string, data: UpdateUserDTO): Promise<User>;
  updatePassword(id: string, newPasswordHash: string): Promise<void>;
  delete(id: string): Promise<void>;
}
