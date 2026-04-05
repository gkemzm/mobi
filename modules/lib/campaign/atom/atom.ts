import { Campaign, CampaignTableListType } from "@/types/marketing";
import { atom } from "jotai";

export const campaignsAtom = atom<Campaign[]>([]);
export const campaignTableListAtom = atom<CampaignTableListType>({
  items: [],
  page: 1,
  pageSize: 10,
  totalCount: 0,
  totalPages: 1,
});
