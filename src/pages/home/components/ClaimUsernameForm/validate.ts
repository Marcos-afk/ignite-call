import { z } from 'zod';

export const ClaimUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'username deve ter pelo menos 3 caracteres' })
    .regex(/^([a-z\\\\-]+)$/i, {
      message: 'username deve conter apenas letras e hifens',
    })
    .transform((value) => value.toLowerCase()),
});

export type ClaimUsernameFormProps = z.infer<typeof ClaimUsernameFormSchema>;
