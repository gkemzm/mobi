"use client";

import { ParamsType } from "@/types/common";
import DonutChart from "./donutChart/donutChart";
import classes from "./home.module.scss";
import RankChart from "./rankChart/rankChart";
import { getCampaignRank } from "../../../lib/campaign/campaign";
interface HomeCompoentType {
  params: ParamsType;
}
const HomeComponent = async ({ params }: HomeCompoentType) => {
  const data = await getCampaignRank({
    startDate:
      typeof params.searchParams.startDate === "string"
        ? params.searchParams.startDate
        : "",
    endDate:
      typeof params.searchParams.endDate === "string"
        ? params.searchParams.endDate
        : "",
  });

  return (
    <div className={classes.wrapper}>
      <DonutChart params={params} />
      {data && <RankChart params={params} data={data} />}
    </div>
  );
};
export default HomeComponent;
