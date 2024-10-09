import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {MessageType} from "../../types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const mapResponse = (response: any ) : MessageType => {
  return {
    status: response.status,
    data: response.data,
  };
};
