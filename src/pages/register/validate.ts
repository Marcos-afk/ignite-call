import { z } from 'zod';

export const RegisterFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'username deve ter pelo menos 3 caracteres' })
    .regex(/^([a-z\\\\-]+)$/i, {
      message: 'username deve conter apenas letras e hifens',
    })
    .transform((value) => value.toLowerCase()),
  name: z.string().min(3, { message: 'nome deve ter pelo menos 3 caracteres' }),
});

export type RegisterFormProps = z.infer<typeof RegisterFormSchema>;
