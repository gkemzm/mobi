import {
  Campaign,
  CampaignTableListType,
  PlatformPerformanceResponse,
} from "@/types/marketing";
import { atom } from "jotai";

export const campaignsAtom = atom<Campaign[]>([]);
export const campaignTableListAtom = atom<CampaignTableListType>({
  items: [],
  page: 1,
  pageSize: 10,
  totalCount: 0,
  totalPages: 1,
});

export const campaignPerformanceAtom = atom<PlatformPerformanceResponse>({
  metric: "cost",
  total: 0,
  items: [],
});
