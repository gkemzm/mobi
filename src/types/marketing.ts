import { DailyStat } from "./dailyStat";

export interface Campaign {
  id: string;
  name: string;
  platform: "Google" | "Meta" | "Naver";
  status: "active" | "paused" | "ended";
  budget: number;
  startDate: string;
  endDate: string | null;
}

export interface MarketingData {
  campaigns: Campaign[];
  daily_stats: DailyStat[];
}
