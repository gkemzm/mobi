import useQueryString from "@/hooks/useQuerySting";
import { useSetAtom } from "jotai";
import { ParamsType } from "@/types/common";
import {
  campaignsAtom,
  campaignTableListAtom,
} from "../../modules/lib/campaign/atom/atom";
import {
  getCampaigns,
  getCampaignsTableList,
} from "../../modules/lib/campaign/campaign";

const useCampaignData = () => {
  /* ATOM */
  const setCampaigns = useSetAtom(campaignsAtom);
  const setCampaignTableList = useSetAtom(campaignTableListAtom);
  /* ATOM[E] */

  /**
   * 일별추이용 캠페인 데이터 불러오기
   */
  const getCampaignData = async (params: ParamsType) => {
    try {
      const [queryString] = useQueryString(params);
      const items = await getCampaigns(queryString.toString());

      setCampaigns(items);
    } catch (err) {
      console.error("getCampaignData");
    }
  };

  /**
   * 테이블용 캠페인 데이터 불러오기
   */
  const getCampaignTableData = async (params: ParamsType) => {
    try {
      const [queryString] = useQueryString(params);
      const items = await getCampaignsTableList(queryString.toString());
      setCampaignTableList(items);
    } catch (err) {
      console.error("getCampaignData");
    }
  };

  return [getCampaignData, getCampaignTableData];
};

export default useCampaignData;
