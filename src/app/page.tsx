import { ServercomponentPropType } from "@/types/common";

import { FC } from "react";
import DailyStatViewer from "../../modules/pages/home/home";
import { getCampaigns } from "../../modules/lib/campaign/campaign";
import { getDailyStats } from "../../modules/lib/dailyStat/dailyStat";

const Home: FC<ServercomponentPropType> = async (props) => {
  const campaigns = await getCampaigns();

  const selectedCampaign = campaigns[0];

  const dailyStats = selectedCampaign
    ? await getDailyStats({
        campaignId: selectedCampaign.id,
        startDate: "2026-02-01",
        endDate: "2026-04-07",
      })
    : [];

  return <DailyStatViewer data={dailyStats} />;
};

export default Home;
