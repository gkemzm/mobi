import { DailyStat } from "./dailyStat";

export type CampaignStatus = "active" | "paused" | "ended";
export type CampaignPlatform = "Google" | "Meta" | "Naver";

export interface Campaign {
  id: string;
  name: string;
  platform: CampaignPlatform;
  status: CampaignStatus;
  budget: number;
  startDate: string;
  endDate: string | null;
}

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

export interface CampaignTableListType {
  items: CampaignListItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface MarketingData {
  campaigns: Campaign[];
  daily_stats: DailyStat[];
}

// 테이블 리스트 타입
export interface CampaignTableItem {
  id: string;
  name: string;
  status: CampaignStatus;
  platform: CampaignPlatform;
  startDate: string;
  endDate: string | null;
  spend: number;
  ctr: number;
  cpc: number;
  roas: number;
}
