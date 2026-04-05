export const formatNumber = (value: number) => value.toLocaleString("ko-KR");
export const formatPercent = (value: number) => `${value.toFixed(2)}%`;
export const formatCurrency = (value: number) => `₩${formatNumber(value)}`;
export const formatDateRange = (startDate: string, endDate: string | null) =>
  `${startDate}${endDate ? ` ~ ${endDate}` : ""}`;
