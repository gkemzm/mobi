import { CampaignPlatform, CampaignStatus } from "@/types/marketing";

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
