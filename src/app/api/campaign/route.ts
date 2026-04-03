import { NextResponse } from "next/server";
import data from "@/data/db.json";
import type { Campaign, MarketingData } from "@/types/marketing";

export async function GET() {
  try {
    const { campaigns } = data as MarketingData;

    return NextResponse.json<Campaign[]>(campaigns, {
      status: 200,
    });
  } catch (error) {
    console.error("[GET /api/campaign] error:", error);

    return NextResponse.json(
      { message: "캠페인 데이터를 불러오지 못했습니다." },
      { status: 500 },
    );
  }
}
