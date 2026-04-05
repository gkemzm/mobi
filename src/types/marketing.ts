import { DailyStat } from "./dailyStat";

export type CampaignStatus = "active" | "paused" | "ended";
export type CampaignPlatform = "Google" | "Meta" | "Naver";
export type MetricKey = "cost" | "impressions" | "clicks" | "conversions";

// 캠페인 데이터 기본 타입
export interface Campaign {
  id: string;
  name: string;
  platform: CampaignPlatform;
  status: CampaignStatus;
  budget: number;
  startDate: string;
  endDate: string | null;
}

// 캠페인 테이블 res 타입
export interface CampaignTableListType {
  items: CampaignListItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
// 캠페인 테이블 items 타입
export interface CampaignListItem {
  id: string;
  name: string;
  status: CampaignStatus;
  platform: CampaignPlatform;
  startDate: string;
  endDate: string | null;
  budget: number;

  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  conversionsValue: number;

  ctr: number; // %
  cpc: number; // 원
  roas: number; // %
}

export interface MarketingData {
  campaigns: Campaign[];
  daily_stats: DailyStat[];
}

// 캠페인 등록모달 폼타입
export interface CampaignFormValues {
  name: string;
  platform: CampaignPlatform | "";
  budget: string;
  spend: string;
  startDate: string;
  endDate: string;
}
// 캠페인 등록모달 에러처리 타입
export interface CampaignFormErrors {
  name?: string;
  platform?: string;
  budget?: string;
  spend?: string;
  startDate?: string;
  endDate?: string;
}

// 캠페인 모달 테이터 타입
export interface CampaignModalType {
  id: string;
  name: string;
  platform: CampaignPlatform;
  status: CampaignStatus;
  budget: number;
  startDate: string;
  endDate: string | null;
  spend: number;
}

export interface MarketingData {
  campaigns: Campaign[];
  daily_stats: DailyStat[];
}

export interface PlatformPerformanceItem {
  platform: CampaignPlatform;
  value: number;
  percent: number;
}

export interface PlatformPerformanceResponse {
  metric: MetricKey;
  total: number;
  items: PlatformPerformanceItem[];
}
