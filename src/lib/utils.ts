import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const authorization = {
  headers: {
    Authorization: `Bearer test_94757ffefadf27ed714c158bdd2205`,
  },
};