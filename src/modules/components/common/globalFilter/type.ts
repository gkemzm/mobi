import { CampaignPlatform, CampaignStatus } from "@/types/campaign";

export interface GlobalFilterProps {
  value?: GlobalFilterState;
  onChange?: (nextFilter: GlobalFilterState) => void;
  onClose: () => void;
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
