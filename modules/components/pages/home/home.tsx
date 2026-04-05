"use client";

import { ParamsType } from "@/types/common";
import DonutChart from "../../common/donutChart/donutChart";

interface HomeCompoentType {
  params: ParamsType;
}
const HomeComponent = ({ params }: HomeCompoentType) => {
  return (
    <>
      <DonutChart params={params} />
    </>
  );
};
export default HomeComponent;
