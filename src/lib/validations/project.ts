import * as z from 'zod'

export const projectNameSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Username must be longer than 3 characters. Let's try again!",
    })
    .max(24, {
      message:
        'Hold on! Username must be shorter than 32 characters. Give it another shot!',
    }),
})
