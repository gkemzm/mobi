export interface Campaign {
  id: string;
  name: string;
  platform: "Google" | "Meta" | "Naver";
  status: "active" | "paused" | "ended";
  budget: number;
  startDate: string;
  endDate: string | null;
}

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

export interface MarketingData {
  campaigns: Campaign[];
  daily_stats: DailyStat[];
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
}

export interface DailyStatResponse {
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
