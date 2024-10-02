import { type ClassValue, clsx } from "clsx"
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toastError(status: number | undefined, toastId?: string) {
  switch (status) {
    case 400:
      toast.error("Bad Request", { id: toastId });
      break;
    case 404:
      toast.error("Not Found", { id: toastId });
      break;
    case 500:
      toast.error("Terjadi kesalahan", { id: toastId });
      break;
    default:
      toast.error("Terjadi kesalahan", { id: toastId });
  }
}