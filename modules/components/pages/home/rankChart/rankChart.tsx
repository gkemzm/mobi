"use client";
import useCampaignData from "@/hooks/useCampaignData";
import classes from "./rankChart.module.scss";
import { useEffect, useState } from "react";
import { ParamsType } from "@/types/common";
import { useAtomValue } from "jotai";
import { campaignRankAtom } from "../../../../lib/campaign/atom/atom";
import { CAMPAIGN_RANK_FILTER_BTN_DATA } from "./data";

interface RankChartType {
  params: ParamsType;
}
const RankChart = ({ params }: RankChartType) => {
  const { getCampaignRankData } = useCampaignData();
  /* ATOM */
  const campaignRank = useAtomValue(campaignRankAtom);
  /* ATOM[E] */
  const [type, setType] = useState<"roas" | "ctr" | "cpc">("roas");

  const items = campaignRank?.[type] ?? [];

  const onClickType = (type: "roas" | "ctr" | "cpc") => {
    setType(type);
  };
  useEffect(() => {
    getCampaignRankData(params);
  }, [params]);
  return (
    <section className={classes.card}>
      <div className={classes.header}>
        <h2 className={classes.title}>캠페인 랭킹 Top 3</h2>

        <div className={classes.tabGroup}>
          {CAMPAIGN_RANK_FILTER_BTN_DATA.map((data) => (
            <button
              key={data.value}
              type="button"
              className={`${classes.tab} ${
                data.value === type && classes.active
              }`}
              onClick={() => onClickType(data.value)}
            >
              {data.name}
            </button>
          ))}
        </div>
      </div>
      <div className={classes.list}>
        {items.map((item) => (
          <article key={item.campaignId} className={classes.item}>
            <div className={classes.row}>
              <div className={classes.left}>
                <div className={classes.rank}>{item.rank}</div>

                <div className={classes.content}>
                  <div className={classes.nameRow}>
                    <strong className={classes.name}>{item.name}</strong>
                    <span className={classes.badge}>{item.platform}</span>
                  </div>

                  <div className={classes.barTrack}>
                    <div
                      className={classes.barFill}
                      style={{ width: `${item.barPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className={classes.value}>{item.value}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default RankChart;
