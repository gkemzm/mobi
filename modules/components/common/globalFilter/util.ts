import { GlobalFilterState } from "./type";

const pad = (value: number) => String(value).padStart(2, "0");

export const formatDateToString = (date: Date) => {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());

  return `${year}-${month}-${day}`;
};

export const parseStringToDate = (value: string) => {
  if (!value) return undefined;

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) return undefined;

  return new Date(year, month - 1, day);
};

export const formatDisplayDate = (value: string) => {
  if (!value) return "";
  return value.replace(/-/g, ".");
};

export const getMonthRange = (date = new Date()) => {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  return {
    from: formatDateToString(firstDay),
    to: formatDateToString(lastDay),
  };
};
export const getInitialGlobalFilter = (): GlobalFilterState => ({
  period: getMonthRange(),
  statuses: ["active", "paused", "ended"],
  platforms: ["Google", "Meta", "Naver"],
});

export const transFilterQuery = (filter: GlobalFilterState) => {
  const params = new URLSearchParams();

  if (filter.period.from) {
    params.append("startDate", filter.period.from);
  }

  if (filter.period.to) {
    params.append("endDate", filter.period.to);
  }

  filter.statuses.forEach((status) => {
    params.append("status", status);
  });

  filter.platforms.forEach((platform) => {
    params.append("platform", platform);
  });

  return params.toString();
};

export const toggleArrayValue = <T>(array: T[], value: T) => {
  if (array.includes(value)) {
    return array.filter((item) => item !== value);
  }

  return [...array, value];
};
