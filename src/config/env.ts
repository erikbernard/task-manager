import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("3333"),
  JWT_SECRET: z.string(),
});

// O método `safeParse` não dispara um erro se a validação falhar
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    'Variáveis de ambiente inválidas:',
    parsedEnv.error.flatten().fieldErrors,
  );
  throw new Error('Variáveis de ambiente inválidas.');
}

export const env = parsedEnv.data;