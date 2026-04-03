"use client";
import { layoutList } from "@/data/layout";
import classes from "./sidebar.module.scss";
import { usePathname, useRouter } from "next/navigation";
import { LayoutItem } from "@/types/layout";

const Sidebar = () => {
  const router = useRouter();
  const pathName = usePathname();

  const onClickList = (item: LayoutItem) => {
    router.push(`/dashboard/${item.id}`);
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
