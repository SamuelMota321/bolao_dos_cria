import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .email("Forneça um email válido"),
    password: z
        .string()
        .min(1, "Forneça uma senha")
});