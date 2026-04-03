import { NextResponse } from "next/server";
import data from "@/data/db.json";
import type { Campaign, MarketingData } from "@/types/marketing";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);

    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const status = searchParams.get("status");
    const platform = searchParams.get("platform");
    const name = searchParams.get("name");

    let { campaigns } = data as MarketingData;

    // 1. name null 제거
    campaigns = campaigns.filter((c) => c.name !== null);

    // 2. 필터 적용
    const filtered = campaigns.filter((c) => {
      // 시작일 필터 (이후 데이터)
      if (startDate && c.startDate < startDate) return false;

      // 종료일 필터 (이전 데이터)
      if (endDate && c.endDate && c.endDate > endDate) return false;

      // 상태 필터
      if (status && c.status !== status) return false;

      // 매체 필터
      if (platform && c.platform !== platform) return false;

      // 이름 필터 (부분 검색)
      if (name && !c.name.toLowerCase().includes(name.toLowerCase()))
        return false;

      return true;
    });

    return NextResponse.json<Campaign[]>(filtered, {
      status: 200,
    });
  } catch (error) {
    console.error("[GET /api/campaign] error:", error);

    return NextResponse.json(
      { message: "캠페인 데이터를 불러오지 못했습니다." },
      { status: 500 }
    );
  }
};
