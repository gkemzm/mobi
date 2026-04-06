import { NextRequest, NextResponse } from "next/server";
import data from "@/data/db.json";
import type {
  Campaign,
  CampaignRankingItem,
  CampaignRankingResponse,
  CampaingRankingMetricKey,
  MarketingData,
} from "@/types/marketing";
import { DailyStat } from "@/types/dailyStat";

interface CampaignAggregate {
  campaignId: string;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  conversionsValue: number;
}

const isDateInRange = (
  targetDate: string,
  startDate?: string,
  endDate?: string
): boolean => {
  if (startDate && targetDate < startDate) return false;
  if (endDate && targetDate > endDate) return false;

  return true;
};

const calculateRoas = (aggregate: CampaignAggregate): number => {
  if (aggregate.cost <= 0) return 0;

  return Number(
    ((aggregate.conversionsValue / aggregate.cost) * 100).toFixed(2)
  );
};

const calculateCtr = (aggregate: CampaignAggregate): number => {
  if (aggregate.impressions <= 0) return 0;

  return Number(((aggregate.clicks / aggregate.impressions) * 100).toFixed(2));
};

const calculateCpc = (aggregate: CampaignAggregate): number => {
  if (aggregate.clicks <= 0) return 0;

  return Number((aggregate.cost / aggregate.clicks).toFixed(2));
};

const buildRankingItems = (
  metric: CampaingRankingMetricKey,
  aggregates: CampaignAggregate[],
  campaignMap: Map<string, Campaign>,
  limit: number
): CampaignRankingItem[] => {
  const ranked = aggregates
    .map((aggregate) => {
      const campaign = campaignMap.get(aggregate.campaignId);
      if (!campaign) return null;

      let value = 0;

      if (metric === "roas") value = calculateRoas(aggregate);
      if (metric === "ctr") value = calculateCtr(aggregate);
      if (metric === "cpc") value = calculateCpc(aggregate);

      return {
        campaignId: aggregate.campaignId,
        name: campaign.name,
        platform: campaign.platform,
        value,
      };
    })
    .filter(
      (
        item
      ): item is {
        campaignId: string;
        name: string;
        platform: Campaign["platform"];
        value: number;
      } => item !== null
    )
    .sort((a, b) => {
      if (metric === "cpc") {
        return a.value - b.value; // cpc
      }

      return b.value - a.value; // roas, ctr
    })
    .slice(0, limit);

  const baseValue =
    metric === "cpc"
      ? ranked[ranked.length - 1]?.value ?? 0 // 최대값
      : ranked[0]?.value ?? 0; // 최대값

  return ranked.map((item, index) => ({
    rank: index + 1,
    campaignId: item.campaignId,
    name: item.name,
    platform: item.platform,
    value: item.value,
    barPercent:
      baseValue > 0
        ? metric === "cpc"
          ? Number(((baseValue / item.value) * 100).toFixed(1)) // 역비율
          : Number(((item.value / baseValue) * 100).toFixed(1))
        : 0,
  }));
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const startDate = searchParams.get("startDate") ?? undefined;
    const endDate = searchParams.get("endDate") ?? undefined;
    const limit = Math.max(1, Number(searchParams.get("limit") ?? 3));

    const { campaigns, daily_stats } = data as MarketingData;

    const campaignMap = new Map<string, Campaign>();
    campaigns.forEach((campaign) => {
      campaignMap.set(campaign.id, campaign);
    });

    const aggregateMap = new Map<string, CampaignAggregate>();

    daily_stats.forEach((stat: DailyStat) => {
      if (!isDateInRange(stat.date, startDate, endDate)) return;
      if (!campaignMap.has(stat.campaignId)) return;

      const prev = aggregateMap.get(stat.campaignId) ?? {
        campaignId: stat.campaignId,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        cost: 0,
        conversionsValue: 0,
      };

      const safeValue =
        typeof stat.conversionsValue === "number" &&
        !isNaN(stat.conversionsValue)
          ? stat.conversionsValue
          : 0;

      aggregateMap.set(stat.campaignId, {
        campaignId: stat.campaignId,
        impressions: prev.impressions + stat.impressions,
        clicks: prev.clicks + stat.clicks,
        conversions: prev.conversions + stat.conversions,
        cost: prev.cost + stat.cost,
        conversionsValue: prev.conversionsValue + safeValue,
      });
    });

    const aggregates = Array.from(aggregateMap.values());

    const response: CampaignRankingResponse = {
      roas: buildRankingItems("roas", aggregates, campaignMap, limit),
      ctr: buildRankingItems("ctr", aggregates, campaignMap, limit),
      cpc: buildRankingItems("cpc", aggregates, campaignMap, limit),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("[GET /api/dashboard/campaign-ranking] error:", error);

    return NextResponse.json(
      { message: "캠페인 랭킹 데이터를 불러오지 못했습니다." },
      { status: 500 }
    );
  }
}
