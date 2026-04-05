"use client";

import { KeyboardEvent, useEffect, useState } from "react";
import classes from "./campaignTable.module.scss";
import {
  CampaignListItem,
  CampaignStatus,
  CampaignTableItem,
} from "@/types/marketing";
import {
  formatCurrency,
  formatDateRange,
  formatNumber,
  formatPercent,
} from "./util";
import { STATUS_CLASS, STATUS_LABEL } from "./data";
import useCampaignData from "@/hooks/useCampaignData";
import { ParamsType } from "@/types/common";
import { TableHeaderType } from "./type";
import { FiChevronUp } from "react-icons/fi";
import { FiChevronDown } from "react-icons/fi";

interface CampaignTableProps {
  params: ParamsType;
  headers: TableHeaderType[];
  items: CampaignTableItem[];
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
  headers,
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
  const [, getCampaignTableData] = useCampaignData();
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  // 정렬용
  const [currentSort, setCurrentSort] = useState("");
  const [currentSortOrder, setCurrentSortOrder] = useState("desc");
  // 상태변경용
  const [tableItems, setTableItems] = useState<CampaignTableItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<CampaignStatus | "">("");

  const isAllChecked =
    tableItems.length > 0 &&
    tableItems.every((item) => selectedIds.includes(item.id));

  const selectedCount = selectedIds.length;

  // 정렬 로직
  const onClickSort = (id: string, type: string) => {
    try {
      const nextSort =
        type === "desc" ? "asc" : type === "asc" ? "desc" : "asc";
      getCampaignTableData({
        ...params,
        searchParams: {
          ...params.searchParams,
          sortBy: id,
          sortOrder: id === currentSort ? nextSort : type,
          page: String(currentPage),
          name: keyword,
        },
      });
      setCurrentSort(id);
      setCurrentSortOrder(id === currentSort ? nextSort : type);
    } catch (err) {
      console.error("sorting error");
    }
  };
  // 전체 선택
  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(tableItems.map((item) => item.id));
      return;
    }

    setSelectedIds([]);
  };
  // 개별 선택
  const handleToggleItem = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      if (checked) {
        if (prev.includes(id)) return prev;
        return [...prev, id];
      }

      return prev.filter((itemId) => itemId !== id);
    });
  };

  // 상태 변경
  const handleApplyBulkStatus = () => {
    if (!bulkStatus || selectedIds.length === 0) return;

    setTableItems((prev) =>
      prev.map((item) =>
        selectedIds.includes(item.id)
          ? {
              ...item,
              status: bulkStatus,
            }
          : item
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
    <section className={classes.container}>
      <div className={classes.header}>
        <h3 className={classes.title}>캠페인 목록</h3>

        <button
          type="button"
          className={classes.createButton}
          onClick={onClickCreate}
        >
          <span className={classes.plus}>＋</span>
          캠페인 등록
        </button>
      </div>

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

      <div className={classes.tableWrap}>
        <table className={classes.table}>
          <colgroup>
            <col style={{ width: "52px" }} />
            {headers.map((data) => (
              <col key={data.id} style={{ width: data.width }} />
            ))}
          </colgroup>

          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={isAllChecked}
                  onChange={(e) => handleToggleAll(e.target.checked)}
                />
              </th>
              {headers.map((data) => {
                const isSort = data.isSort;
                const type =
                  currentSortOrder === "" ? "desc" : currentSortOrder;

                return (
                  <th
                    onClick={() => isSort && onClickSort(data.id, type)}
                    key={data.id}
                    className={isSort ? classes.sort : classes.normal}
                  >
                    {data.label}
                    <span className={classes.sortArea}>
                      {currentSort === data.id && type === "desc" ? (
                        <FiChevronDown />
                      ) : currentSort === data.id && type === "asc" ? (
                        <FiChevronUp />
                      ) : (
                        ""
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {tableItems.map((item) => (
              <tr key={item.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={(e) =>
                      handleToggleItem(item.id, e.target.checked)
                    }
                  />
                </td>
                <td className={classes.nameCell}>{item.name}</td>
                <td>
                  <span
                    className={`${classes.statusBadge} ${
                      STATUS_CLASS[item.status]
                    }`}
                  >
                    {STATUS_LABEL[item.status]}
                  </span>
                </td>
                <td>{item.platform}</td>
                <td>{formatDateRange(item.startDate, item.endDate)}</td>
                <td>{formatCurrency(item.spend)}</td>
                <td>{formatPercent(item.ctr)}</td>
                <td>{formatNumber(item.cpc)}</td>
                <td className={` ${classes.roas}`}>{item.roas.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={classes.footer}>
        <span className={classes.paginationInfo}>
          {items.length > 0
            ? `${(currentPage - 1) * 10 + 1}-${
                (currentPage - 1) * 10 + items.length
              }`
            : "0-0"}{" "}
          / {totalCount}
        </span>

        <div className={classes.pagination}>
          <button
            type="button"
            className={classes.pageArrow}
            onClick={() => onChangePage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            ‹
          </button>

          {pages.map((page) => (
            <button
              key={page}
              type="button"
              className={`${classes.pageButton} ${
                currentPage === page ? classes.pageActive : ""
              }`}
              onClick={() => onChangePage(page)}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            className={classes.pageArrow}
            onClick={() => onChangePage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
};

export default CampaignTable;
