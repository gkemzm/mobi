"use client";
import { layoutList } from "@/data/layout";
import classes from "./sidebar.module.scss";
import { usePathname, useRouter } from "next/navigation";
import { LayoutItem } from "@/types/layout";

const Sidebar = () => {
  const router = useRouter();
  const pathName = usePathname();

  const onClickList = (item: LayoutItem) => {
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
  };

  return (
    <aside className={classes.sidebar}>
      <div className={classes.logo}>LOGO</div>

      <nav className={classes.nav}>
        {layoutList.map((item) => {
          return (
            <button
              className={`${classes.item} ${
                pathName === `/dashboard/${item.id}` && classes.active
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
