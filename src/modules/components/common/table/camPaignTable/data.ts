import { CampaignStatus } from "@/types/campaign";
import classes from "./campaignTable.module.scss";

export const STATUS_LABEL: Record<CampaignStatus, string> = {
  active: "진행중",
  paused: "일시중지",
  ended: "종료",
};

export const STATUS_CLASS: Record<CampaignStatus, string> = {
  active: classes.active,
  paused: classes.paused,
  ended: classes.ended,
};
