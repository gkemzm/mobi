import { NextRequest, NextResponse } from "next/server";
import data from "@/data/db.json";
import type {
  Campaign,
  MarketingData,
  MetricKey,
  CampaignPlatform,
  PlatformPerformanceItem,
  PlatformPerformanceResponse,
} from "@/types/marketing";
import { DailyStat } from "@/types/dailyStat";

const AVAILABLE_PLATFORMS: CampaignPlatform[] = ["Google", "Meta", "Naver"];
const AVAILABLE_METRICS: MetricKey[] = [
  "cost",
  "impressions",
  "clicks",
  "conversions",
];

const isMetricKey = (value: string | null): value is MetricKey => {
  if (!value) return false;

  return AVAILABLE_METRICS.includes(value as MetricKey);
};

const isDateInRange = (
  targetDate: string,
  startDate?: string,
  endDate?: string
): boolean => {
  if (startDate && targetDate < startDate) return false;
  if (endDate && targetDate > endDate) return false;

  return true;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const metric: MetricKey = isMetricKey(searchParams.get("metric"))
      ? (searchParams.get("metric") as MetricKey)
      : "cost";

    const startDate = searchParams.get("startDate") ?? undefined;
    const endDate = searchParams.get("endDate") ?? undefined;

    const { campaigns, daily_stats } = data as MarketingData;

    const filteredCampaigns: Campaign[] = campaigns;

    const campaignPlatformMap = new Map<string, CampaignPlatform>();
    filteredCampaigns.forEach((campaign) => {
      campaignPlatformMap.set(campaign.id, campaign.platform);
    });

    const platformValueMap = new Map<CampaignPlatform, number>();
    AVAILABLE_PLATFORMS.forEach((platform) => {
      platformValueMap.set(platform, 0);
    });

    daily_stats.forEach((stat: DailyStat) => {
      const platform = campaignPlatformMap.get(stat.campaignId);

      if (!platform) return;
      if (!isDateInRange(stat.date, startDate, endDate)) return;

      const prevValue = platformValueMap.get(platform) ?? 0;
      const nextValue = prevValue + (stat[metric] ?? 0);

      platformValueMap.set(platform, nextValue);
    });

    const items: PlatformPerformanceItem[] = AVAILABLE_PLATFORMS.map(
      (platform) => ({
        platform,
        value: platformValueMap.get(platform) ?? 0,
        percent: 0,
      })
    );

    const total = items.reduce((acc, item) => acc + item.value, 0);

    const normalizedItems: PlatformPerformanceItem[] = items.map((item) => ({
      ...item,
      percent: total > 0 ? Number(((item.value / total) * 100).toFixed(1)) : 0,
    }));

    const response: PlatformPerformanceResponse = {
      metric,
      total,
      items: normalizedItems,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("[GET /api/dashboard/platform-performance] error:", error);

    return NextResponse.json(
      {
        message: "플랫폼별 성과 데이터를 불러오지 못했습니다.",
      },
      { status: 500 }
    );
  }
}
