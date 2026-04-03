"use client";
import { usePathname } from "next/navigation";
import classes from "./header.module.scss";
import { layoutList } from "@/data/layout";

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
        <p>통계 데이터를 확인하세요</p>
      </div>
    </header>
  );
};

export default Header;
