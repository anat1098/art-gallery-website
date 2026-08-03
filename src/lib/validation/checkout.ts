import { z } from "zod";

export const checkoutSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Enter a valid email address"),
  phone: z.string().min(5, "Enter a valid phone number"),
  country: z.string().min(1, "Select a country"),
  city: z.string().min(1, "City is required"),
  street: z.string().min(1, "Street address is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  shippingNotes: z.string().optional(),
  orderNotes: z.string().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
