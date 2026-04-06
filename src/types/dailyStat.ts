import { Campaign } from "./marketing";
// 기본 일별 추이 타입
export interface DailyStatType {
  id: string;
  campaignId: string;
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  conversionsValue: number | null;
}
// roas ctr cpc를 계산한 타입
export interface DailyStatSummaryType {
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
// 일별 추이 response타입
export interface DailyStatResponseType {
  name: string;
  success: boolean;
  campaignId: string;
  startDate: string;
  endDate: string;
  data: DailyStatSummaryType[];
}
// 일별 추이 파라미터 타입
export interface GetDailyStatsParamsType {
  campaignId: string;
  startDate: string;
  endDate: string;
}
