"use client";

import { ParamsType } from "@/types/common";
import CampaignTable from "../../common/table/campaignTable";
import { KeyboardEvent, useEffect, useState } from "react";
import useCampaignData from "@/hooks/useCampaignData";
import { useAtom, useAtomValue } from "jotai";
import { campaignTableListAtom } from "../../../lib/campaign/atom/atom";
import { TABLE_HEADER_DATA } from "../../common/table/data";
import { Campaign } from "@/types/marketing";
import CampaignAddModal from "../../modal/campaignAddModal/campaignAddModal";

interface HomeCompoentType {
  params: ParamsType;
}

const CampaignComponent = ({ params }: HomeCompoentType) => {
  /* ATOM */
  const [campaignTableList, setCampaignTableList] = useAtom(
    campaignTableListAtom
  );
  /* ATOM[E] */
  // 테이블 페이지네이션 검색
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  // 모달 열기
  const [isOpen, setIsOpen] = useState(false);

  const { getCampaignTableData } = useCampaignData();

  const onChangePage = (page: number) => {
    getCampaignTableData({
      ...params,
      searchParams: {
        ...params.searchParams,
        name: keyword,
        page: String(page),
      },
    });
    setPage(page);
    sessionStorage.setItem("tableSearchPage", String(page));
  };

  const onKeyDownKeyword = (value: KeyboardEvent<HTMLInputElement>) => {
    if (value.key === "Enter" && !value.nativeEvent.isComposing) {
      getCampaignTableData({
        ...params,
        searchParams: {
          ...params.searchParams,
          page: String(1),
          name: keyword,
        },
      });

      sessionStorage.setItem("tableSearchKeyWord", keyword);
      setPage(1);
    }
  };

  // 캠페인 추가 (휘발성)
  const handleRegisterCampaign = (campaign: Campaign) => {
    const newItems = campaignTableList.items.filter(
      (item, idx) => idx !== campaignTableList.items.length - 1
    );
    newItems.unshift({
      ...campaign,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      spend: 0,
      conversionsValue: 0,
      ctr: 0,
      cpc: 0,
      roas: 0,
    });
    setCampaignTableList({
      ...campaignTableList,
      items: newItems,
      totalCount: campaignTableList.totalCount + 1,
    });
  };

  useEffect(() => {
    const page = sessionStorage.getItem("tableSearchPage");
    const word = sessionStorage.getItem("tableSearchKeyWord");
    getCampaignTableData({
      ...params,
      searchParams: {
        ...params.searchParams,
        name: typeof word === "string" ? word : "",
        page: typeof page === "string" ? page : "1",
      },
    });

    setKeyword(typeof word === "string" ? word : "");
    setPage(typeof page === "string" ? Number(page) : 1);
  }, [params]);

  return (
    <div>
      <CampaignAddModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleRegisterCampaign}
      />
      {campaignTableList && (
        <CampaignTable
          params={params}
          headers={TABLE_HEADER_DATA}
          items={campaignTableList.items}
          totalCount={campaignTableList.totalCount}
          currentPage={page}
          totalPages={campaignTableList.totalPages}
          keyword={keyword}
          onChangeKeyword={setKeyword}
          onKeyDown={onKeyDownKeyword}
          onClickCreate={() => {
            setIsOpen(true);
          }}
          onChangePage={onChangePage}
        />
      )}
    </div>
  );
};
export default CampaignComponent;
