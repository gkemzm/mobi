import { Campaign } from "./marketing";

export interface DailyStat {
  id: string;
  campaignId: string;
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  conversionsValue: number | null;
}

export interface DailyStatSummary {
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  conversionsValue: number;
  ctr: number;
  cpc: number;
  roas: number;
  campaignData?: Campaign;
}

export interface DailyStatResponse {
  name: string;
  success: boolean;
  campaignId: string;
  startDate: string;
  endDate: string;
  data: DailyStatSummary[];
}

export interface GetDailyStatsParams {
  campaignId: string;
  startDate: string;
  endDate: string;
}
