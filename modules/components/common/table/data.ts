import { CampaignStatus } from "@/types/campaign";
import classes from "./campaignTable.module.scss";
import { TableHeaderType } from "./type";

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

export const TABLE_HEADER_DATA: TableHeaderType[] = [
  { id: "name", label: "캠페인명", width: "240px", isSort: false },
  { id: "status", label: "상태", width: "120px", isSort: false },
  { id: "platform", label: "매체", width: "96px", isSort: false },
  {
    id: "period",
    label: "집행기간",
    width: "260px",
    isSort: true,
    sort: "desc",
  },
  {
    id: "spend",
    label: "집행금액",
    width: "140px",
    isSort: true,
    sort: "desc",
  },
  { id: "ctr", label: "CTR (%)", width: "96px", isSort: true, sort: "desc" },
  { id: "cpc", label: "CPC (원", width: "96px", isSort: true, sort: "desc" },
  { id: "roas", label: "ROAS (%)", width: "108px", isSort: true, sort: "desc" },
];
