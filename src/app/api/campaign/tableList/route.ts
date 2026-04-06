import { NextResponse } from "next/server";
import data from "@/data/db.json";
import type { MarketingData } from "@/types/marketing";
import { DailyStatType } from "@/types/dailyStat";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);

    const startDate = searchParams.get("startDate")!;
    const endDate = searchParams.get("endDate")!;
    const statuses = searchParams.getAll("status");
    const platforms = searchParams.getAll("platform");
    const name = searchParams.get("name")?.toLowerCase() || "";
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder") ?? "desc";

    const page = Number(searchParams.get("page") ?? 1);
    const pageSize = Number(searchParams.get("pageSize") ?? 10);

    const { campaigns, daily_stats } = data as MarketingData;

    // Campaign 필터링
    const filteredCampaigns = campaigns.filter((c) => {
      const campaignEnd = c.endDate ?? "9999-12-31";
      const values = Object.values(c);
      // value 값중 null 체크
      if (values.includes(null)) {
        return false;
      }

      if (
        c.status !== "active" &&
        c.status !== "paused" &&
        c.status !== "ended"
      )
        return false;

      if (
        c.platform !== "Naver" &&
        c.platform !== "Google" &&
        c.platform !== "Meta"
      )
        return false;

      // 기간 겹침
      if (c.startDate > endDate || campaignEnd < startDate) return false;

      // 상태
      if (statuses.length && !statuses.includes(c.status)) return false;

      // 매체
      if (platforms.length && !platforms.includes(c.platform)) return false;

      // 이름
      if (name && !c.name.toLowerCase().includes(name)) return false;

      return true;
    });

    // 기간 내 DailyStat만 필터
    const filteredStats = daily_stats.filter((s) => {
      return s.date >= startDate && s.date <= endDate;
    });

    // campaignId 기준 집계
    const statsMap = new Map<string, DailyStatType[]>();

    filteredStats.forEach((stat) => {
      if (!statsMap.has(stat.campaignId)) {
        statsMap.set(stat.campaignId, []);
      }
      statsMap.get(stat.campaignId)!.push(stat);
    });

    // Campaign + 집계 merge
    const items = filteredCampaigns.map((c) => {
      const stats = statsMap.get(c.id) ?? [];

      const impressions = stats.reduce((sum, s) => sum + s.impressions, 0);
      const clicks = stats.reduce((sum, s) => sum + s.clicks, 0);
      const conversions = stats.reduce((sum, s) => sum + s.conversions, 0);
      const spend = stats.reduce((sum, s) => sum + s.cost, 0);
      const conversionsValue = stats.reduce(
        (sum, s) => sum + (s.conversionsValue ?? 0),
        0
      );

      const ctr = impressions ? (clicks / impressions) * 100 : 0;
      const cpc = clicks ? spend / clicks : 0;
      const roas = spend ? (conversionsValue / spend) * 100 : 0;

      return {
        id: c.id,
        name: c.name,
        status: c.status,
        platform: c.platform,
        startDate: c.startDate,
        endDate: c.endDate,
        budget: c.budget,

        impressions,
        clicks,
        conversions,
        spend,
        conversionsValue,
        ctr,
        cpc,
        roas,
      };
    });

    // 페이지네이션
    const totalCount = items.length;
    const totalPages = Math.ceil(totalCount / pageSize);

    const pagedItems = items.slice((page - 1) * pageSize, page * pageSize);

    // 정렬
    if (sortBy) {
      pagedItems.sort((a, b) => {
        let aValue = 0;
        let bValue = 0;

        switch (sortBy) {
          case "period":
            // 시작일 기준 정렬
            aValue = new Date(a.startDate).getTime();
            bValue = new Date(b.startDate).getTime();
            break;

          case "spend":
            aValue = a.spend;
            bValue = b.spend;
            break;

          case "ctr":
            aValue = a.ctr;
            bValue = b.ctr;
            break;

          case "cpc":
            aValue = a.cpc;
            bValue = b.cpc;
            break;

          case "roas":
            aValue = a.roas;
            bValue = b.roas;
            break;

          default:
            return 0;
        }

        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      });
    }

    return NextResponse.json({
      items: pagedItems,
      totalCount,
      page,
      pageSize,
      totalPages,
    });
  } catch (error) {
    console.error("[GET /api/campaign-list] error:", error);

    return NextResponse.json(
      { message: "캠페인 목록 조회 실패" },
      { status: 500 }
    );
  }
};
