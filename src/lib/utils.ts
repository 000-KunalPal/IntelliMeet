import { clsx, type ClassValue } from "clsx";
import humanizeDuration from "humanize-duration";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(duration: number) {
  return humanizeDuration(duration * 1000, {
    largest: 1,
    round: true,
    units: ["h", "m", "s"],
  });
}
