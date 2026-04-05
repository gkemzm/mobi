import useQueryString from "@/hooks/useQuerySting";
import { useSetAtom } from "jotai";
import { ParamsType } from "@/types/common";
import {
  campaignPerformanceAtom,
  campaignsAtom,
  campaignTableListAtom,
} from "../../modules/lib/campaign/atom/atom";
import {
  getCampaigns,
  getCampaignsTableList,
  getPlatformPerformance,
} from "../../modules/lib/campaign/campaign";
import { useState } from "react";

const useCampaignData = () => {
  /* ATOM */
  const setCampaigns = useSetAtom(campaignsAtom);
  const setCampaignTableList = useSetAtom(campaignTableListAtom);
  const setCampaignPerformance = useSetAtom(campaignPerformanceAtom);
  /* ATOM[E] */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 일별추이용 캠페인 데이터 불러오기
   */
  const getCampaignData = async (params: ParamsType) => {
    try {
      setIsLoading(true);
      const [queryString] = useQueryString(params);
      const items = await getCampaigns(queryString.toString());

      setCampaigns(items);
    } catch (err) {
      console.error("getCampaignData");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 테이블용 캠페인 데이터 불러오기
   */
  const getCampaignTableData = async (params: ParamsType) => {
    try {
      setIsLoading(true);
      const [queryString] = useQueryString(params);
      const items = await getCampaignsTableList(queryString.toString());
      setCampaignTableList(items);
    } catch (err) {
      console.error("getCampaignData");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 테이블용 캠페인 데이터 불러오기
   */
  const getCampaignPerformance = async (params: ParamsType) => {
    try {
      setIsLoading(true);
      const [queryString] = useQueryString(params);
      const items = await getPlatformPerformance(queryString.toString());
      setCampaignPerformance(items);
    } catch (err) {
      console.error("getCampaignData");
    } finally {
      setIsLoading(false);
    }
  };

  return [getCampaignData, getCampaignTableData, getCampaignPerformance];
};

export default useCampaignData;
