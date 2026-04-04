"use client";
import { usePathname } from "next/navigation";
import classes from "./header.module.scss";
import { layoutList } from "@/data/layout";
import GlobalFilter from "../common/globalFilter/globalFilter";

const Header = () => {
  const pathName = usePathname();
  return (
    <header className={classes.header}>
      <div>
        <h1>
          {
            layoutList.find((item) => `/dashboard/${item.id}` === pathName)
              ?.name
          }
        </h1>
        <p>
          {
            layoutList.find((item) => `/dashboard/${item.id}` === pathName)
              ?.description
          }
        </p>
      </div>
      <div className={classes.filterArea}>
        <GlobalFilter />
      </div>
    </header>
  );
};

export default Header;
