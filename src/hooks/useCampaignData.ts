import useQueryString from "@/hooks/useQuerySting";
import { useSetAtom } from "jotai";
import { ParamsType } from "@/types/common";
import { campaignsAtom } from "../../modules/lib/campaign/atom/atom";
import { getCampaigns } from "../../modules/lib/campaign/campaign";

const useCampaignData = () => {
  /* ATOM */
  const setCampaigns = useSetAtom(campaignsAtom);
  /* ATOM[E] */
  const getCampaignData = async (params: ParamsType) => {
    try {
      const [queryString] = useQueryString(params);
      const items = await getCampaigns(queryString.toString());

      setCampaigns(items);
    } catch (err) {
      console.error("getCampaignData");
    }
  };

  return [getCampaignData];
};

export default useCampaignData;
