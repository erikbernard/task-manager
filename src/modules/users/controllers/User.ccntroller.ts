import { NextFunction, Request, Response } from "express";
import { changePasswordSchema, createUserSchema, loginUserSchema, updateUserSchema } from "../dtos/user.dto";
import { UserService } from "../services/User.service";
import { AuthenticatedRequest } from "../../../shared/interfaces/IAuthenticatedRequest";

export class UserController {
  constructor(private userService: UserService) {}

  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const userData = createUserSchema.parse(req.body);
      const user = await this.userService.create(userData);
      return res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const loginData = loginUserSchema.parse(req.body);
      const result = await this.userService.login(loginData);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const userId = (req as unknown as AuthenticatedRequest).userId;
      const user = await this.userService.getProfile(userId);
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
  
  async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const userId = (req as unknown as AuthenticatedRequest).userId;
      const userData = updateUserSchema.parse(req.body);
      const user = await this.userService.update(userId, userData);
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const userId = (req as unknown as AuthenticatedRequest).userId;
      const passwordData = changePasswordSchema.parse(req.body);
      await this.userService.changePassword(userId, passwordData);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const userId = (req as unknown as AuthenticatedRequest).userId;
      await this.userService.delete(userId);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
