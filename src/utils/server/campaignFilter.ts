import { Campaign, CampaignPlatform, CampaignStatus } from "@/types/campaign";

interface FilteredCampaignsType {
  campaigns: Campaign[];
  startDate?: string | null;
  endDate?: string | null;
  statuses?: string[];
  platforms?: string[];
  name?: string;
}
export const CampaignServerFilter = ({
  campaigns,
  startDate,
  endDate,
  statuses,
  platforms,
  name,
}: FilteredCampaignsType) => {
  const filteredCampaigns: Campaign[] = campaigns.filter((c) => {
    const values = Object.values(c);
    // value 값중 null 체크
    if (values.includes(null)) {
      return false;
    }

    if (c.status !== "active" && c.status !== "paused" && c.status !== "ended")
      return false;

    if (
      c.platform !== "Naver" &&
      c.platform !== "Google" &&
      c.platform !== "Meta"
    )
      return false;
    // 집행 기간 겹침 여부
    if (startDate && endDate) {
      const campaignStart = c.startDate;
      const campaignEnd = c.endDate ?? "9999-12-31";

      if (campaignStart > endDate || campaignEnd < startDate) {
        return false;
      }
    }

    // 상태 필터 (다중 선택)
    if (statuses && statuses.length > 0 && !statuses.includes(c.status)) {
      return false;
    }

    // 매체 필터 (다중 선택)
    if (platforms && platforms.length > 0 && !platforms.includes(c.platform)) {
      return false;
    }

    // 이름 검색
    if (name && !c.name.toLowerCase().includes(name)) {
      return false;
    }

    return true;
  });

  return { filteredCampaigns };
};
