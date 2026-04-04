export type CampaignStatus = "active" | "paused" | "ended";
export type CampaignPlatform = "Google" | "Meta" | "Naver";

export interface GlobalFilterProps {
  value?: GlobalFilterState;
  onChange?: (nextFilter: GlobalFilterState) => void;
}

export interface DateRangeValue {
  from: string;
  to: string;
}

export interface GlobalFilterState {
  period: DateRangeValue;
  statuses: CampaignStatus[];
  platforms: CampaignPlatform[];
}
