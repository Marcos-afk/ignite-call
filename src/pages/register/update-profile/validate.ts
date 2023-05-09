import { z } from 'zod';

export const UpdateProfileSchema = z.object({
  bio: z.string(),
});

export type UpdateProfileProps = z.infer<typeof UpdateProfileSchema>;
