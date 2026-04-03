import { DailyStatResponse, GetDailyStatsParams } from "@/types/marketing";
import { DailyStatAtomType } from "../../atom/dailyStat/atom";

export async function getDailyStats({
  campaignId,
  startDate,
  endDate,
}: GetDailyStatsParams): Promise<DailyStatAtomType> {
  const params = new URLSearchParams({
    campaignId,
    startDate,
    endDate,
  });

  const response = await fetch(
    `http://localhost:3000/api/dailyStat?${params.toString()}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("일별 성과 데이터를 불러오지 못했습니다.");
  }

  const result: DailyStatResponse = await response.json();
  return { name: result.name, data: result.data };
}
