import { ParamsType } from "@/types/common";
import { FC } from "react";
import DailyComponent from "@/modules/components/pages/daily/daily";
import { getCampaigns } from "@/modules/lib/campaign/campaign";

const DailyPage: FC<ParamsType> = async (props) => {
  const campaigns = await getCampaigns();

  return <DailyComponent params={props} datas={{ campaigns }} />;
};

export default DailyPage;
