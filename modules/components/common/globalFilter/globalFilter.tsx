"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { ko } from "date-fns/locale";
import type {
  GlobalFilterState,
  CampaignPlatform,
  CampaignStatus,
  GlobalFilterProps,
} from "./type";
import {
  formatDateToString,
  formatDisplayDate,
  getInitialGlobalFilter,
  parseStringToDate,
  toggleArrayValue,
  transFilterQuery,
} from "./util";
import classes from "./globalFilter.module.scss";
import "react-day-picker/dist/style.css";
import { useRouter } from "next/navigation";
import { PLATFORM_OPTIONS, STATUS_OPTIONS } from "./data";

const GlobalFilter = ({ value, onChange }: GlobalFilterProps) => {
  const router = useRouter();
  const initialValue = useMemo(() => getInitialGlobalFilter(), []);
  const [internalFilter, setInternalFilter] =
    useState<GlobalFilterState>(initialValue);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const filter = value ?? internalFilter;
  const filterRef = useRef<HTMLDivElement | null>(null);

  const selectedRange: DateRange | undefined = {
    from: parseStringToDate(filter.period.from),
    to: parseStringToDate(filter.period.to),
  };

  const updateFilter = (nextFilter: GlobalFilterState) => {
    if (!value) {
      setInternalFilter(nextFilter);
    }

    onChange?.(nextFilter);

    sessionStorage.setItem("globalFilterValue", JSON.stringify(nextFilter));
  };

  const handleRangeChange = (range: DateRange | undefined) => {
    updateFilter({
      ...filter,
      period: {
        from: range?.from ? formatDateToString(range.from) : "",
        to: range?.to ? formatDateToString(range.to) : "",
      },
    });
  };

  const handleStatusClick = (status: CampaignStatus) => {
    updateFilter({
      ...filter,
      statuses: toggleArrayValue(filter.statuses, status),
    });
  };

  const handlePlatformClick = (platform: CampaignPlatform) => {
    updateFilter({
      ...filter,
      platforms: toggleArrayValue(filter.platforms, platform),
    });
  };

  const handleReset = () => {
    updateFilter(getInitialGlobalFilter());
    setIsCalendarOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!filterRef.current) return;

      if (!filterRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const tranQueryData = transFilterQuery(filter);
    router.push(`?${tranQueryData}`);
  }, [filter]);

  useEffect(() => {
    const prevFilter = sessionStorage.getItem("globalFilterValue");
    if (prevFilter && typeof prevFilter === "string") {
      try {
        const parseData = JSON.parse(prevFilter);

        updateFilter(parseData);
      } catch (err) {
        console.error("filter parseError");
      }
    }

    if (!prevFilter) {
      const newObj = {
        period: initialValue.period,
        statuses: initialValue.statuses,
        platforms: initialValue.platforms,
      };
      sessionStorage.setItem("globalFilterValue", JSON.stringify(newObj));
    }
  }, []);

  return (
    <div className={classes.filter} ref={filterRef}>
      <div className={classes.group}>
        <span className={classes.label}>집행기간</span>

        <div className={classes.dateRange}>
          <div className={classes.btnWrapper}>
            <button
              type="button"
              className={classes.dateTrigger}
              onClick={() => setIsCalendarOpen((prev) => !prev)}
            >
              <span>{formatDisplayDate(filter.period.from)}</span>
            </button>

            <button
              type="button"
              className={classes.dateTrigger}
              onClick={() => setIsCalendarOpen((prev) => !prev)}
            >
              <span>{formatDisplayDate(filter.period.to)}</span>
            </button>
          </div>
          {isCalendarOpen && (
            <div className={classes.calendarLayer}>
              <DayPicker
                mode="range"
                locale={ko}
                selected={selectedRange}
                onSelect={handleRangeChange}
                numberOfMonths={2}
                pagedNavigation
              />
            </div>
          )}
        </div>
      </div>

      <div className={classes.divider} />

      <div className={classes.group}>
        <span className={classes.label}>상태</span>

        <div className={classes.chips}>
          {STATUS_OPTIONS.map((item) => {
            const isActive = filter.statuses.includes(item.value);

            return (
              <button
                key={item.value}
                type="button"
                className={`${classes.chip} ${isActive ? classes.active : ""}`}
                onClick={() => handleStatusClick(item.value)}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className={classes.divider} />

      <div className={classes.group}>
        <span className={classes.label}>매체</span>

        <div className={classes.chips}>
          {PLATFORM_OPTIONS.map((item) => {
            const isActive = filter.platforms.includes(item.value);

            return (
              <button
                key={item.value}
                type="button"
                className={`${classes.chip} ${isActive ? classes.active : ""}`}
                onClick={() => handlePlatformClick(item.value)}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className={classes.divider} />

      <button
        type="button"
        className={classes.resetButton}
        onClick={handleReset}
      >
        초기화
      </button>
    </div>
  );
};

export default GlobalFilter;
