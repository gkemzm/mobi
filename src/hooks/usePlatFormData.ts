import useQueryString from "@/hooks/useQuerySting";
import { useSetAtom } from "jotai";
import { ParamsType } from "@/types/common";

import { useState } from "react";
import { getPlatformPerformanceData } from "@/modules/lib/platform/platform";
import { platformPerformanceAtom } from "@/modules/lib/platform/atom/atom";

const usePlatformData = () => {
  /* ATOM */
  const setCampaignPerformance = useSetAtom(platformPerformanceAtom);
  /* ATOM[E] */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 테이블용 플랫폼 성과 데이터 불러오기
   */
  const getPlatformPerformance = async (params: ParamsType) => {
    try {
      setIsLoading(true);
      const [queryString] = useQueryString(params);
      const items = await getPlatformPerformanceData(queryString.toString());
      setCampaignPerformance(items);
    } catch (err) {
      console.error("getCampaignData");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getPlatformPerformance,
    isLoading,
  };
};

export default usePlatformData;
