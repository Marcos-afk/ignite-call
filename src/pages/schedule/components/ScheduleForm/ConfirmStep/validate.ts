import { z } from 'zod';

export const ConfirmStepFormSchema = z.object({
  name: z.string().nonempty({ message: 'Nome obrigatório' }),
  email: z.string().email({ message: 'E-mail inválido' }),
  observations: z.string().nullable(),
});

export type ConfirmStepFormProps = z.infer<typeof ConfirmStepFormSchema>;
