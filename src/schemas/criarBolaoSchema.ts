import { z } from "zod";

export const createBolaoSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  password: z.string().min(4, "Senha deve ter pelo menos 4 caracteres"),
  campeonato: z.string().min(1, "Selecione um campeonato"),
});

export type CreateBolaoForm = z.infer<typeof createBolaoSchema>;
