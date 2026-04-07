"use client";

import { ParamsType } from "@/types/common";
import DonutChart from "./donutChart/donutChart";
import classes from "./home.module.scss";
import RankChart from "./rankChart/rankChart";
interface HomeCompoentType {
  params: ParamsType;
}
const HomeComponent = ({ params }: HomeCompoentType) => {
  return (
    <div className={classes.wrapper}>
      <DonutChart params={params} />
      <RankChart params={params} />
    </div>
  );
};
export default HomeComponent;
