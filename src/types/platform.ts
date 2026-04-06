import { CampaignPlatform } from "./campaign";
export type MetricKey = "cost" | "impressions" | "clicks" | "conversions";

// 매체별 통계 데이터
export interface PlatformPerformanceItemType {
  platform: CampaignPlatform;
  value: number;
  percent: number;
}
// 매체별 통계 데이터 response
export interface PlatformPerformanceResponseType {
  metric: MetricKey;
  total: number;
  items: PlatformPerformanceItemType[];
}
