"use client";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import classes from "./donutChart.module.scss";
import { useAtomValue } from "jotai";
import { campaignPerformanceAtom } from "../../../lib/campaign/atom/atom";
import { useEffect, useState } from "react";
import useCampaignData from "@/hooks/useCampaignData";
import { ParamsType } from "@/types/common";

interface DountChartType {
  params: ParamsType;
}
const DonutChart = ({ params }: DountChartType) => {
  /* ATOM */
  const campaignPerformance = useAtomValue(campaignPerformanceAtom);
  /* ATOM[E] */
  const [getCampaignData, getCampaignTableData, getCampaignPerformance] =
    useCampaignData();
  const [type, setType] = useState("cost");

  const options: Highcharts.Options = {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
      height: 200,
    },
    title: {
      text: undefined,
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      pointFormat: "{point.name}: <b>{point.y}</b> ({point.percentage:.1f}%)",
    },
    plotOptions: {
      pie: {
        innerSize: "65%", // ⭐ 도넛 핵심
        borderWidth: 0,
        dataLabels: {
          enabled: false,
        },
      },
    },
    series: [
      {
        type: "pie",
        data: [
          {
            name: "Google",
            y: 268803425,
            color: "#6C8FF5",
          },
          {
            name: "Meta",
            y: 203786625,
            color: "#C9D4E5",
          },
          {
            name: "Naver",
            y: 338607502,
            color: "#5BC58C",
          },
        ],
      },
    ],
  };
  useEffect(() => {
    getCampaignPerformance({
      ...params,
      searchParams: { ...params.searchParams, metric: type },
    });
  }, [params, type]);
  return (
    <div className={classes.wrapper}>
      <div className={classes.chart}>
        <HighchartsReact highcharts={Highcharts} options={options} />{" "}
      </div>
      <div className={classes.legend}>
        <div className={classes.buttonWrapper}>
          <button
            className={type === "cost" ? classes.checked : classes.btn}
            onClick={() => setType("cost")}
          >
            비용
          </button>
          <button
            className={type === "impressions" ? classes.checked : classes.btn}
            onClick={() => setType("impressions")}
          >
            노출수
          </button>
          <button
            className={type === "clicks" ? classes.checked : classes.btn}
            onClick={() => setType("clicks")}
          >
            클릭수
          </button>
          <button
            className={type === "conversions" ? classes.checked : classes.btn}
            onClick={() => setType("conversions")}
          >
            전환수
          </button>
        </div>
        {campaignPerformance.items.map((item) => (
          <div key={item.platform} className={classes.legendItem}>
            <div
              className={classes.dot}
              style={{
                backgroundColor:
                  item.platform === "Google"
                    ? "#6C8FF5"
                    : item.platform === "Meta"
                    ? "#C9D4E5"
                    : item.platform === "Naver"
                    ? "#5BC58C"
                    : "#bebebe",
              }}
            />

            <span className={classes.name}>{item.platform}</span>

            <span className={classes.value}>
              {type === "cost" ? "₩" : ""}
              {item.value.toLocaleString()}
            </span>

            <span className={classes.percent}>({item.percent}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
