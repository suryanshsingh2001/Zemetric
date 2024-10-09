import { z } from "zod";

export const smsFormSchema = z.object({
    phoneNumber: z.string(),
    message: z
      .string()
      .min(1, "Message is required")
      .max(160, "Message must not exceed 160 characters"),
  })
  
export  type SMSFormData = z.infer<typeof smsFormSchema>