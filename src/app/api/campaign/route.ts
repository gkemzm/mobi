import { NextResponse } from "next/server";
import data from "@/data/db.json";
import type { Campaign, MarketingData } from "@/types/campaign";
import { CampaignServerFilter } from "@/utils/server/campaignFilter";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);

    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const statuses = searchParams.getAll("status");
    const platforms = searchParams.getAll("platform");
    const name = searchParams.get("name")?.trim().toLowerCase();

    const { campaigns } = data as MarketingData;

    const { filteredCampaigns } = CampaignServerFilter({
      campaigns,
      startDate,
      endDate,
      statuses,
      platforms,
      name,
    });

    return NextResponse.json<Campaign[]>(filteredCampaigns, {
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
