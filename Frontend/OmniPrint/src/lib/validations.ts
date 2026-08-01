import z from "zod";
 
export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .max(20, { message: "Password must be less than 20 characters" })
  .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, {
    message: "Password must contain at least one special character",
  })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" });

// Signup Schema
export const signupSchema = z.object({
  email: z.string().min(3).max(50).email("Invalid email format"),
  name: z.string().min(2).max(20, "Name must be between 2 and 20 characters"),
  phoneNumber: z.string().min(10).max(10, "Phone number must be 10 digits"),
  password: passwordSchema,
});

// Login Schema
export const loginSchema = z.object({
  email: z.string().min(3).max(50).email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});
 
export type SignupInput = z.infer<typeof signupSchema>;

export type LoginInput = z.infer<typeof loginSchema>;