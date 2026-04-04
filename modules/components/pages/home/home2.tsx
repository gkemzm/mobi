"use client";

import { DailyStatResponse, DailyStatSummary } from "@/types/dailyStat";
import { useEffect, useState } from "react";

export default function DailyStatViewer({ data }: any) {
  const [stats, setStats] = useState<DailyStatSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDailyStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        campaignId: "GGL-001",
        startDate: "2026-02-01",
        endDate: "2026-04-07",
      });

      const response = await fetch(`/api/dailyStat?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "데이터 조회에 실패했습니다.");
      }

      const result: DailyStatResponse = await response.json();
      setStats(result.data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "알 수 없는 에러가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  //   useEffect(() => {
  //     fetchDailyStats();
  //   }, []);

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <div>
      <h2 className="border-red-500">일별 성과</h2>

      {stats.length === 0 ? (
        <div>데이터가 없습니다.</div>
      ) : (
        <ul>
          {stats.map((item) => (
            <li key={item.date}>
              <div>날짜: {item.date}</div>
              <div>노출수: {item.impressions}</div>
              <div>클릭수: {item.clicks}</div>
              <div>전환수: {item.conversions}</div>
              <div>비용: {item.cost}</div>
              <div>전환가치: {item.conversionsValue}</div>
              <div>CTR: {item.ctr}%</div>
              <div>CPC: {item.cpc}원</div>
              <div>ROAS: {item.roas}%</div>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
