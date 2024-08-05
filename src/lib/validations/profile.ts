import * as z from 'zod'

const usernameSchema = z
  .string()
  .min(3, {
    message: "Username must be longer than 3 characters. Let's try again!",
  })
  .max(32, {
    message:
      'Hold on! Username must be shorter than 32 characters. Give it another shot!',
  })

const websiteSchema = z
  .string()
  .url(
    "Aaaand... that's not a website URL. We need something like 'https://www.example.com' to continue. Can you give us a hand here?"
  )

export const profileUserNameSchema = z.object({
  username: usernameSchema,
})

export const profileWebsiteSchema = z.object({
  website: websiteSchema,
})

export const profileSchema = z.object({
  username: usernameSchema.optional(),
  website: websiteSchema.optional(),
  email: z.string().email("That doesn't looks like an email to me.").optional(),
})
