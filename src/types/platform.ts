import { CampaignPlatform } from "./marketing";
export type MetricKey = "cost" | "impressions" | "clicks" | "conversions";

// 매체별 통계 데이터
export interface PlatformPerformanceItem {
  platform: CampaignPlatform;
  value: number;
  percent: number;
}
// 매체별 통계 데이터 response
export interface PlatformPerformanceResponse {
  metric: MetricKey;
  total: number;
  items: PlatformPerformanceItem[];
}
