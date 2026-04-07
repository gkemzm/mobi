"use client";
import classes from "./campaignTable.module.scss";
import { KeyboardEvent, useEffect, useMemo, useState } from "react";
import { CampaignListItem, CampaignStatus } from "@/types/campaign";
import {
  formatCurrency,
  formatDateRange,
  formatNumber,
  formatPercent,
} from "./util";
import { STATUS_CLASS, STATUS_LABEL } from "./data";
import useCampaignData from "@/hooks/useCampaignData";
import { ParamsType } from "@/types/common";
import CommonTable from "../commonTable";

interface CampaignTableProps {
  params: ParamsType;
  items: CampaignListItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  keyword: string;
  onKeyDown: (value: KeyboardEvent<HTMLInputElement>) => void;
  onChangeKeyword: (value: string) => void;
  onClickCreate: () => void;
  onChangePage: (page: number) => void;
}

const CampaignTable = ({
  params,
  items,
  totalCount,
  currentPage,
  totalPages,
  keyword,
  onChangeKeyword,
  onClickCreate,
  onChangePage,
  onKeyDown,
}: CampaignTableProps) => {
  const { getCampaignTableData } = useCampaignData();

  const [currentSort, setCurrentSort] = useState("");
  const [currentSortOrder, setCurrentSortOrder] = useState<"asc" | "desc">(
    "desc"
  );
  const [tableItems, setTableItems] = useState<CampaignListItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<CampaignStatus | "">("");

  const columns = useMemo(
    () => [
      {
        id: "name",
        label: "캠페인명",
        width: "240px",
        sortable: false,
        render: (item: CampaignListItem) => (
          <span className={classes.titleName}>{item.name}</span>
        ),
      },
      {
        id: "status",
        label: "상태",
        width: "120px",
        sortable: false,
        render: (item: CampaignListItem) => (
          <span className={`${STATUS_CLASS[item.status]}`}>
            {STATUS_LABEL[item.status]}
          </span>
        ),
      },
      {
        id: "platform",
        label: "매체",
        width: "100px",
        sortable: false,
        render: (item: CampaignListItem) => item.platform,
      },
      {
        id: "period",
        label: "진행기간",
        width: "220px",
        sortable: true,
        render: (item: CampaignListItem) =>
          formatDateRange(item.startDate, item.endDate),
      },
      {
        id: "spend",
        label: "집행금액",
        width: "140px",
        sortable: true,
        render: (item: CampaignListItem) => formatCurrency(item.spend),
      },
      {
        id: "ctr",
        label: "CTR",
        width: "100px",
        sortable: true,
        render: (item: CampaignListItem) => formatPercent(item.ctr),
      },
      {
        id: "cpc",
        label: "CPC",
        width: "120px",
        sortable: true,
        render: (item: CampaignListItem) => formatNumber(item.cpc),
      },
      {
        id: "roas",
        label: "ROAS",
        width: "100px",
        sortable: true,
        render: (item: CampaignListItem) => item.roas.toFixed(2),
      },
    ],
    []
  );

  const handleSort = async (columnId: string, order: "asc" | "desc") => {
    try {
      await getCampaignTableData({
        ...params,
        searchParams: {
          ...params.searchParams,
          sortBy: columnId,
          sortOrder: order,
          page: String(currentPage),
          name: keyword,
        },
      });

      setCurrentSort(columnId);
      setCurrentSortOrder(order);
    } catch (err) {
      console.error("sorting error");
    }
  };

  const handleApplyBulkStatus = () => {
    if (!bulkStatus || selectedIds.length === 0) return;

    setTableItems((prev) =>
      prev.map((item) =>
        selectedIds.includes(item.id) ? { ...item, status: bulkStatus } : item
      )
    );

    setSelectedIds([]);
    setBulkStatus("");
  };

  useEffect(() => {
    setTableItems(items);
    setSelectedIds([]);
    setBulkStatus("");
  }, [items]);

  return (
    <CommonTable
      title="캠페인 목록"
      columns={columns}
      items={tableItems}
      rowKey={(item) => item.id}
      totalCount={totalCount}
      currentPage={currentPage}
      totalPages={totalPages}
      onChangePage={onChangePage}
      selectable
      selectedRowIds={selectedIds}
      onChangeSelectedRowIds={setSelectedIds}
      sortBy={currentSort}
      sortOrder={currentSortOrder}
      onSort={handleSort}
      headerAction={
        <button
          type="button"
          className={classes.createButton}
          onClick={onClickCreate}
        >
          <span className={classes.plus}>＋</span>
          캠페인 등록
        </button>
      }
      toolbar={
        <div className={classes.toolbar}>
          <div className={classes.searchArea}>
            <div className={classes.searchBox}>
              <span className={classes.searchIcon}>⌕</span>
              <input
                value={keyword}
                onChange={(e) => onChangeKeyword(e.target.value)}
                onKeyDown={onKeyDown}
                className={classes.searchInput}
                placeholder="캠페인명 검색"
              />
            </div>

            <span className={classes.count}>{totalCount}건</span>
          </div>

          <div className={classes.bulkActionBar}>
            <select
              value={bulkStatus}
              onChange={(e) =>
                setBulkStatus(e.target.value as CampaignStatus | "")
              }
              className={classes.select}
            >
              <option value="">상태 변경</option>
              <option value="active">진행중</option>
              <option value="paused">일시중지</option>
              <option value="ended">종료</option>
            </select>

            <button
              type="button"
              className={classes.applyButton}
              disabled={!selectedIds.length || !bulkStatus}
              onClick={handleApplyBulkStatus}
            >
              적용
            </button>
          </div>
        </div>
      }
    />
  );
};

export default CampaignTable;
