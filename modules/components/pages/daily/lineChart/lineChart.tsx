"use client";

import dynamic from "next/dynamic";
import Highcharts from "highcharts";
import { useMemo, useState } from "react";
import classes from "./lineChart.module.scss";
import { DailyStatSummary } from "@/types/dailyStat";

const HighchartsReact = dynamic(() => import("highcharts-react-official"), {
  ssr: false,
});

type MetricKey = "impressions" | "clicks";

type MetricConfig = {
  key: MetricKey;
  label: string;
  color: string;
};

type CampaignDailyTrendChartProps = {
  data: DailyStatSummary[];
  totalLength: number;
  title: string;
};

const METRIC_LIST: MetricConfig[] = [
  { key: "impressions", label: "노출수", color: "#5B8FF9" },
  { key: "clicks", label: "클릭수", color: "#A0A7B4" },
];

const NUMBER_FORMATTER = new Intl.NumberFormat("ko-KR", {
  maximumFractionDigits: 2,
});

const formatDateLabel = (date: string) => {
  const target = new Date(date);
  const month = String(target.getMonth() + 1).padStart(2, "0");
  const day = String(target.getDate()).padStart(2, "0");

  return `${month}-${day}`;
};

const formatMetricValue = (metric: MetricKey, value: number) => {
  return NUMBER_FORMATTER.format(value);
};

const CampaignDailyTrendChart = ({
  data,
  totalLength,
  title,
}: CampaignDailyTrendChartProps) => {
  const [activeMetrics, setActiveMetrics] = useState<MetricKey[]>([
    "impressions",
    "clicks",
  ]);
  const onToggleMetric = (metric: MetricKey) => {
    setActiveMetrics((prev) => {
      const isActive = prev.includes(metric);

      if (isActive) {
        if (prev.length === 1) return prev;
        return prev.filter((item) => item !== metric);
      }

      return [...prev, metric];
    });
  };

  const selectedMetricConfigs = useMemo(() => {
    return METRIC_LIST.filter((metric) => activeMetrics.includes(metric.key));
  }, [activeMetrics]);

  const options = useMemo<Highcharts.Options>(() => {
    const chartHeight = totalLength === 1 ? 420 : totalLength === 2 ? 210 : 160;
    return {
      chart: {
        type: "spline",
        height: chartHeight,
        backgroundColor: "#ffffff",
        spacingTop: 0,
        spacingRight: 0,
        spacingBottom: 16,
        spacingLeft: 0,
      },
      title: {
        text: undefined,
      },
      xAxis: {
        categories: data.map((item) => formatDateLabel(item.date)),
        tickmarkPlacement: "on",
        lineColor: "#E5E7EB",
        gridLineColor: "#F1F5F9",
        gridLineDashStyle: "Dash",
        labels: {
          style: {
            color: "#94A3B8",
            fontSize: "12px",
          },
        },
      },
      yAxis: {
        title: {
          text: undefined,
        },
        gridLineColor: "#E5E7EB",
        gridLineDashStyle: "Dash",
        labels: {
          style: {
            color: "#94A3B8",
            fontSize: "12px",
          },
          formatter: function () {
            return NUMBER_FORMATTER.format(Number(this.value));
          },
        },
      },
      legend: {
        enabled: true,
        align: "left",
        verticalAlign: "top",
        itemStyle: {
          color: "#475569",
          fontSize: "12px",
          fontWeight: "500",
        },
        symbolRadius: 999,
      },
      tooltip: {
        shared: true,
        useHTML: true,
        backgroundColor: "#ffffff",
        borderColor: "#E5E7EB",
        shadow: false,
        formatter: function () {
          let html = `<div style="padding:4px 2px;">`;
          html += `<div style="margin-bottom:8px;font-weight:600;color:#0F172A;">${this.x}</div>`;

          this.points?.forEach((point) => {
            const metricKey = point.series.userOptions.custom
              ?.metricKey as MetricKey;
            html += `
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;color:#475569;">
                <span style="color:${point.color};">●</span>
                <span>${point.series.name}:</span>
                <strong style="color:#0F172A;">${formatMetricValue(
                  metricKey,
                  Number(point.y)
                )}</strong>
              </div>
            `;
          });

          html += `</div>`;
          return html;
        },
      },
      plotOptions: {
        series: {
          marker: {
            enabled: false,
            states: {
              hover: {
                enabled: true,
                radius: 4,
              },
            },
          },
          lineWidth: 2,
          states: {
            inactive: {
              opacity: 1,
            },
          },
        },
      },
      series: selectedMetricConfigs.map((metric) => ({
        type: "spline",
        name: metric.label,
        color: metric.color,
        data: data.map((item) => item[metric.key]),
        custom: {
          metricKey: metric.key,
        },
      })),
      credits: {
        enabled: false,
      },
    };
  }, [data, selectedMetricConfigs, totalLength]);

  return (
    <div className={classes.chartCard}>
      <div className={classes.chartHeader}>
        <div className={classes.titleArea}>
          <h3 className={classes.title}>{title || "-"}</h3>
        </div>

        <div className={classes.metricToggleGroup}>
          {METRIC_LIST.map((metric) => {
            const isActive = activeMetrics.includes(metric.key);
            const isDisabled = isActive && activeMetrics.length === 1;

            return (
              <button
                key={metric.key}
                type="button"
                className={`${classes.metricButton} ${
                  isActive ? classes.active : ""
                }`}
                onClick={() => onToggleMetric(metric.key)}
                disabled={isDisabled}
              >
                {metric.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className={classes.chartBody}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
};

export default CampaignDailyTrendChart;
