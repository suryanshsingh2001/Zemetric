import { toast } from "sonner";

export const showToast = (title: string, message: string) => {
  toast(title, {
    description: message,
    duration: 5000,
  });
};
