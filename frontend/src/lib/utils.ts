import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

import { MessageType } from "../../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const mapResponse = (response: any): MessageType => {
  return {
    status: response.status,
    data: response.data,
  };
};

export const getTimeStamp = (errorMessage: string) => {
  // Extract message and timestamp using regex
  const regex = /(.+) at ([\d\-T:\.Z]+)/;
  const match = errorMessage.match(regex);

  if (!match) {
    throw new Error("Invalid error message format");
  }

  const message = match[1].trim();
  const timestamp = match[2];

  // Convert the timestamp into a readable format
  const date = new Date(timestamp);
  const formattedDate = format(date, "yyyy-MM-dd HH:mm:ss"); // e.g., "2024-10-09 05:18:57"

  return {
    message,
    formattedDate,
  };
};
