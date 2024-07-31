import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import conjugator from "./korean/conjugator"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}