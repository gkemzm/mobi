"use client";

import { ParamsType } from "@/types/common";
import CampaignTable from "../../common/table/campaignTable";
import { KeyboardEvent, useEffect, useState } from "react";
import useCampaignData from "@/hooks/useCampaignData";
import { useAtomValue } from "jotai";
import { campaignTableListAtom } from "../../../lib/campaign/atom/atom";
import { TABLE_HEADER_DATA } from "../../common/table/data";

interface HomeCompoentType {
  params: ParamsType;
}

const CampaignComponent = ({ params }: HomeCompoentType) => {
  /* ATOM */
  const campaignTableList = useAtomValue(campaignTableListAtom);
  /* ATOM[E] */
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);

  const [, getCampaignTableData] = useCampaignData();

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
          onClickCreate={() => {}}
          onChangePage={onChangePage}
        />
      )}
    </div>
  );
};
export default CampaignComponent;
