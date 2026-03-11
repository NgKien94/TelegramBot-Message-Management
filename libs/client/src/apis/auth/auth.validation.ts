import z from 'zod'

export const loginFormSchema = z.object({
  email: z.email('The email field has to have @ symbol').nonempty('Email is required'),
  password: z
    .string('Password is string')
    .nonempty('Password is required')
    .min(6, 'Password minimum length is 6 characters')
})

export type LoginFormValues = z.infer<typeof loginFormSchema>
