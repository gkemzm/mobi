import { ParamsType } from "@/types/common";
import { FC } from "react";
import CampaignComponent from "@/modules/components/pages/campaign/campaign";

const CampaignPage: FC<ParamsType> = async (props) => {
  return <CampaignComponent params={props} />;
};

export default CampaignPage;
