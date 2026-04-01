import { formatDate } from "./formatters";

export const timeAgo = (date: Date | string): string => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return `il y a ${diffSec} seconde${diffSec > 1 ? "s" : ""}`;
  if (diffMin < 60) return `il y a ${diffMin} minute${diffMin > 1 ? "s" : ""}`;
  if (diffHour < 24)
    return `il y a ${diffHour} heure${diffHour > 1 ? "s" : ""}`;
  if (diffDay < 7) return `il y a ${diffDay} jour${diffDay > 1 ? "s" : ""}`;

  return formatDate(past);
};

export const isToday = (date: Date | string): boolean => {
  const today = new Date();
  const compareDate = new Date(date);
  return (
    compareDate.getDate() === today.getDate() &&
    compareDate.getMonth() === today.getMonth() &&
    compareDate.getFullYear() === today.getFullYear()
  );
};

export const isThisWeek = (date: Date | string): boolean => {
  const now = new Date();
  const compareDate = new Date(date);
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
  const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6));
  return compareDate >= weekStart && compareDate <= weekEnd;
};
