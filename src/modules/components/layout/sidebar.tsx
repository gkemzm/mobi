"use client";
import classes from "./sidebar.module.scss";
import { usePathname, useRouter } from "next/navigation";
import { LayoutItemType } from "@/types/layout";
import { useAtom } from "jotai";
import { isSidebarOpenAtom } from "../../lib/common/layout/atom/atom";
import { useEffect } from "react";
import { layoutList } from "./layout";

const Sidebar = () => {
  const router = useRouter();
  const pathName = usePathname();
  /* ATOM */
  const [isSidebarOpen, setIsSidebarOpen] = useAtom(isSidebarOpenAtom);
  /* ATOM[E] */

  const onClickList = (item: LayoutItemType) => {
    const globalValue = sessionStorage.getItem("globalFilterValue");
    if (globalValue && typeof globalValue === "string") {
      try {
        const parseData = JSON.parse(globalValue);
        const newObj = {
          startDate: parseData.period.from,
          endDate: parseData.period.to,
          statuses: parseData.statuses,
          platforms: parseData.platforms,
        };
        const url = new URLSearchParams(newObj);
        router.push(`/dashboard/${item.id}?${url.toString()}`);
      } catch (err) {
        console.error("filter parseError");
      }
    } else {
      router.push(`/dashboard/${item.id}`);
    }

    sessionStorage.removeItem("tableSearchPage");
    sessionStorage.removeItem("tableSearchKeyWord");

    sessionStorage.removeItem("dailyCheck");
    sessionStorage.removeItem("daily_checked");
    sessionStorage.removeItem("dailyKeyword");

    setIsSidebarOpen(false);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <aside
      className={`${classes.sidebar} ${isSidebarOpen ? classes.open : ""}`}
    >
      <div className={classes.top}>
        <div className={classes.logo}>LOGO</div>

        <button
          type="button"
          className={classes.closeButton}
          onClick={() => setIsSidebarOpen(false)}
          aria-label="사이드바 닫기"
        >
          ✕
        </button>
      </div>

      <nav className={classes.nav}>
        {layoutList.map((item) => {
          return (
            <button
              type="button"
              className={`${classes.item} ${
                pathName === `/dashboard/${item.id}` ? classes.active : ""
              }`}
              key={item.id}
              onClick={() => onClickList(item)}
            >
              {item.name}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
