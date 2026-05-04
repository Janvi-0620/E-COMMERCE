import { z } from 'zod';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().regex(
    PASSWORD_REGEX,
    'Password must be 8+ chars, with uppercase, lowercase, number and special character'
  ),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const checkoutSchema = z.object({
  address: z.string().min(5, 'Address is too short'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(5, 'Invalid postal code'),
  country: z.string().min(2, 'Country is required'),
});
