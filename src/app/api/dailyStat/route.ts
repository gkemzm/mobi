import { NextRequest, NextResponse } from "next/server";
import data from "@/data/db.json";
import type {
  DailyStat,
  DailyStatSummary,
  MarketingData,
} from "@/types/marketing";

function normalizeNumber(value: number | string | null | undefined): number {
  if (value === null || value === undefined) return 0;

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const cleanedValue = value.replace(/,/g, "").trim();
    const parsedValue = Number(cleanedValue);
    return Number.isFinite(parsedValue) ? parsedValue : 0;
  }

  return 0;
}

function normalizeDate(value: string | null | undefined): string | null {
  if (!value || typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const normalized = trimmed.replace(/\./g, "-").replace(/\//g, "-");
  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString().slice(0, 10);
}

function calculateCTR(clicks: number, impressions: number): number {
  if (impressions === 0) return 0;
  return Number(((clicks / impressions) * 100).toFixed(2));
}

function calculateCPC(cost: number, clicks: number): number {
  if (clicks === 0) return 0;
  return Number((cost / clicks).toFixed(2));
}

function calculateROAS(conversionsValue: number, cost: number): number {
  if (cost === 0) return 0;
  return Number(((conversionsValue / cost) * 100).toFixed(2));
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const campaignId = searchParams.get("campaignId");
    const startDate = normalizeDate(searchParams.get("startDate"));
    const endDate = normalizeDate(searchParams.get("endDate"));

    if (!campaignId) {
      return NextResponse.json(
        { message: "campaignId는 필수입니다." },
        { status: 400 },
      );
    }

    if (!startDate || !endDate) {
      return NextResponse.json(
        {
          message:
            "startDate와 endDate는 유효한 날짜 형식이어야 합니다. (YYYY-MM-DD)",
        },
        { status: 400 },
      );
    }

    if (startDate > endDate) {
      return NextResponse.json(
        { message: "startDate는 endDate보다 클 수 없습니다." },
        { status: 400 },
      );
    }

    const { daily_stats } = data as MarketingData;

    const filteredStats = daily_stats.filter((item: DailyStat) => {
      const itemDate = normalizeDate(item.date);

      if (!itemDate) return false;
      if (item.campaignId !== campaignId) return false;
      if (itemDate < startDate) return false;
      if (itemDate > endDate) return false;

      return true;
    });

    const groupedByDate = filteredStats.reduce<
      Record<string, DailyStatSummary>
    >((acc, item) => {
      const date = normalizeDate(item.date);

      if (!date) return acc;

      if (!acc[date]) {
        acc[date] = {
          date,
          impressions: 0,
          clicks: 0,
          conversions: 0,
          cost: 0,
          conversionsValue: 0,
          ctr: 0,
          cpc: 0,
          roas: 0,
        };
      }

      acc[date].impressions += normalizeNumber(item.impressions);
      acc[date].clicks += normalizeNumber(item.clicks);
      acc[date].conversions += normalizeNumber(item.conversions);
      acc[date].cost += normalizeNumber(item.cost);
      acc[date].conversionsValue += normalizeNumber(item.conversionsValue);

      return acc;
    }, {});

    const result: DailyStatSummary[] = Object.values(groupedByDate)
      .map((item) => ({
        ...item,
        ctr: calculateCTR(item.clicks, item.impressions),
        cpc: calculateCPC(item.cost, item.clicks),
        roas: calculateROAS(item.conversionsValue, item.cost),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json(
      {
        success: true,
        campaignId,
        startDate,
        endDate,
        data: result,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[GET /api/dailyStat] error:", error);

    return NextResponse.json(
      { message: "일간 성과 데이터를 불러오지 못했습니다." },
      { status: 500 },
    );
  }
}
