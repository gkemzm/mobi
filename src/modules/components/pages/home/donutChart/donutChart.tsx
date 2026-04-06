"use client";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import classes from "./donutChart.module.scss";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { ParamsType } from "@/types/common";
import { FILTER_BTN_DATA } from "./data";
import usePlatformData from "@/hooks/usePlatFormData";
import { platformPerformanceAtom } from "../../../../lib/platform/atom/atom";

interface DountChartType {
  params: ParamsType;
}
const DonutChart = ({ params }: DountChartType) => {
  /* ATOM */
  const platformPerformance = useAtomValue(platformPerformanceAtom);
  /* ATOM[E] */
  const { getPlatformPerformance } = usePlatformData();
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
    getPlatformPerformance({
      ...params,
      searchParams: { ...params.searchParams, metric: type },
    });
  }, [params, type]);
  return (
    <div className={classes.wrapper}>
      <div className={classes.header}>
        <h2 className={classes.title}>매체별 통계</h2>
      </div>
      <div className={classes.chartArea}>
        <div className={classes.chart}>
          <HighchartsReact highcharts={Highcharts} options={options} />{" "}
        </div>
        <div className={classes.legend}>
          <div className={classes.buttonWrapper}>
            {FILTER_BTN_DATA.map((data) => (
              <button
                key={data.value}
                className={type === data.value ? classes.checked : classes.btn}
                onClick={() => setType(data.value)}
              >
                {data.name}
              </button>
            ))}
          </div>
          {platformPerformance.items.map((item) => (
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
    </div>
  );
};

export default DonutChart;
