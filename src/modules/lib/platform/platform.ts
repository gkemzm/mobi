import { PlatformPerformanceResponseType } from "@/types/platform";

export async function getPlatformPerformanceData(
  queryString?: string
): Promise<PlatformPerformanceResponseType> {
  const response = await fetch(
    `http://localhost:3000/api/platform/performance?${queryString}`,
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
