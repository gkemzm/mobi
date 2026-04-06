import {
  DailyStatResponseType,
  GetDailyStatsParamsType,
} from "@/types/dailyStat";
import { DailyStatAtomType } from "./atom/atom";

export async function getDailyStats({
  campaignId,
  startDate,
  endDate,
}: GetDailyStatsParamsType): Promise<DailyStatAtomType> {
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

  const result: DailyStatResponseType = await response.json();
  return { name: result.name, data: result.data };
}
