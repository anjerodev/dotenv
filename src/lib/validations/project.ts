import * as z from 'zod'

const nameSchema = z
  .string()
  .min(2, {
    message: "Username must be longer than 3 characters. Let's try again!",
  })
  .max(24, {
    message:
      'Hold on! Username must be shorter than 32 characters. Give it another shot!',
  })

export const projectSchema = z.object({
  name: nameSchema,
  owner: z.string().optional(),
})

export const editProjectSchema = z.object({
  name: nameSchema,
  removedDocs: z.array(z.string()),
})
