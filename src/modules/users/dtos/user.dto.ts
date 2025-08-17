import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(3, "O nome precisa ter no mínimo 3 caracteres."),
  email: z.string().email("Formato de e-mail inválido."),
  password: z.string().min(6, "A senha precisa ter no mínimo 6 caracteres."),
});

export const loginUserSchema = z.object({
  email: z.string().email("Formato de e-mail inválido."),
  password: z.string().min(6, "A senha precisa ter no mínimo 6 caracteres."),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(3, "O nome precisa ter no mínimo 3 caracteres.")
    .optional(),
  email: z.string().email("Formato de e-mail inválido."),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'A senha antiga é obrigatória.'),
  newPassword: z.string().min(6, 'A nova senha precisa ter no mínimo 6 caracteres.'),
});


// Inferidos tipos usando schemas do zod
export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type LoginUserDTO = z.infer<typeof loginUserSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
export type ChangePasswordDTO = z.infer<typeof changePasswordSchema>;