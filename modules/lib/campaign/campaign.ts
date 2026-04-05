import {
  Campaign,
  CampaignTableListType,
  PlatformPerformanceResponse,
} from "@/types/marketing";

export async function getCampaigns(queryString?: string): Promise<Campaign[]> {
  const response = await fetch(
    `http://localhost:3000/api/campaign?${queryString}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("캠페인 데이터를 불러오지 못했습니다.");
  }

  return response.json();
}

export async function getCampaignsTableList(
  queryString?: string
): Promise<CampaignTableListType> {
  const response = await fetch(
    `http://localhost:3000/api/campaign/tableList?${queryString}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("캠페인 데이터를 불러오지 못했습니다.");
  }

  return response.json();
}

export async function getPlatformPerformance(
  queryString?: string
): Promise<PlatformPerformanceResponse> {
  const response = await fetch(
    `http://localhost:3000/api/campaign/performance?${queryString}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("플랫폼별 성과 데이터를 불러오지 못했습니다.");
  }

  return response.json();
}
