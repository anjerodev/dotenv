import * as z from 'zod'

export const profileSchema = z.object({
  username: z.string().min(3).max(32).optional(),
  website: z.string().url().optional(),
})

export const profileUserNameSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "Username must be longer than 3 characters. Let's try again!",
    })
    .max(32, {
      message:
        'Hold on! Username must be shorter than 32 characters. Give it another shot!',
    }),
})

export const profileWebsiteSchema = z.object({
  website: z
    .string()
    .url(
      "Aaaand... that's not a website URL. We need something like 'https://www.example.com' to continue. Can you give us a hand here?"
    ),
})
