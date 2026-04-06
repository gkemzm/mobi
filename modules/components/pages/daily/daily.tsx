"use client";

import { ParamsType } from "@/types/common";
import { Campaign } from "@/types/campaign";
import { useHydrateAtoms } from "jotai/utils";
import { useAtomValue } from "jotai";
import { useEffect } from "react";

import CampaignList from "./campaignList/campaignList";
import LineChart from "./lineChart/lineChart";
import classes from "./daily.module.scss";
import { campaignsAtom } from "../../../lib/campaign/atom/atom";
import { dailyStatAtom } from "../../../lib/dailyStat/atom/atom";
import useCampaignData from "@/hooks/useCampaignData";

interface DailyCompoentType {
  params: ParamsType;
  datas: {
    campaigns: Campaign[];
  };
}
const DailyComponent = ({ params, datas }: DailyCompoentType) => {
  useHydrateAtoms([[campaignsAtom, datas.campaigns]]);
  /* ATOM */
  const campaigns = useAtomValue(campaignsAtom);
  const dailyStat = useAtomValue(dailyStatAtom);
  /* ATOM[E] */
  const { getCampaignData } = useCampaignData();

  useEffect(() => {
    const name = sessionStorage.getItem("dailyKeyword");
    if (typeof name === "string") {
      getCampaignData({
        ...params,
        searchParams: { ...params.searchParams, name: name },
      });
    } else {
      getCampaignData(params);
    }
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
