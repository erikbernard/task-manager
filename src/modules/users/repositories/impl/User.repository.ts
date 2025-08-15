import { Database } from "sqlite";
import { randomUUID } from "crypto";
import { User } from "../../entities/User";
import { IUserRepository } from "../IUser.repository";
import { CreateUserDTO, UpdateUserDTO } from "../../dtos/user.dto";

export class UserRepository implements IUserRepository {
  constructor(private db: Database) {}

  async create({ name, email, password }: CreateUserDTO): Promise<User> {
    const user: User = {
      id: randomUUID(),
      name,
      email,
      password,
      created_at: new Date().toISOString(),
    };

    await this.db.run(
      "INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)",
      user.id,
      user.name,
      user.email,
      user.password
    );

    delete user.password;
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.db.get<User>(
      "SELECT * FROM users WHERE email = ?",
      email
    );
    return user || null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.db.get<User>(
      "SELECT id, name, email, created_at FROM users WHERE id = ?",
      id
    );
    return user || null;
  }

  async findByIdWithPassword(id: string): Promise<User | null> {
    const user = await this.db.get<User>(
      "SELECT * FROM users WHERE id = ?",
      id
    );
    return user || null;
  }

  async update(id: string, data: UpdateUserDTO): Promise<User> {
    await this.db.run(
      "UPDATE users SET name = ?, email = ? WHERE id = ?",
      data.name,
      data.email,
      id
    );

    const updatedUser = await this.findById(id);
    if (!updatedUser)
      throw new Error("Usuário não encontrado após atualização.");
    return updatedUser;
  }

  async updatePassword(id: string, newPasswordHash: string): Promise<void> {
    await this.db.run(
      "UPDATE users SET password = ? WHERE id = ?",
      newPasswordHash,
      id
    );
  }

  async delete(id: string): Promise<void> {
    await this.db.run("DELETE FROM users WHERE id = ?", id);
  }
}
