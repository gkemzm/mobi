"use client";

import { ParamsType } from "@/types/common";
import { Campaign } from "@/types/marketing";
import { useHydrateAtoms } from "jotai/utils";
import { campaignsAtom } from "../../../atom/campaign/atom";
import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { getCampaigns } from "../../../lib/campaign/campaign";
import useQueryString from "../../../hooks/useQuerySting";
import CampaignList from "./campaignList/campaignList";
import LineChart from "./lineChart/lineChart";
import classes from "./daily.module.scss";
import { dailyStatAtom } from "../../../atom/dailyStat/atom";

interface DailyCompoentType {
  params: ParamsType;
  datas: {
    campaigns: Campaign[];
  };
}
const DailyComponent = ({ params, datas }: DailyCompoentType) => {
  useHydrateAtoms([[campaignsAtom, datas.campaigns]]);
  /* ATOM */
  const [campaigns, setCampaigns] = useAtom(campaignsAtom);
  const dailyStat = useAtomValue(dailyStatAtom);
  /* ATOM[E] */

  useEffect(() => {
    async function getCampaignData() {
      try {
        const [queryString] = useQueryString(params);
        const items = await getCampaigns(queryString.toString());

        setCampaigns(items);
      } catch (err) {
        console.error("getCampaignData");
      }
    }

    getCampaignData();
  }, [params]);

  return (
    <div className={classes.wrapper}>
      <CampaignList campaignList={campaigns} params={params} />
      <div className={classes.chartWrapper}>
        {dailyStat.map((data, idx) => (
          <LineChart
            data={data.data}
            key={idx}
            totalLength={dailyStat.length}
            title={data.name}
          />
        ))}
      </div>
    </div>
  );
};
export default DailyComponent;
