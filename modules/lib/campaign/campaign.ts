import { Campaign } from "@/types/marketing";

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
