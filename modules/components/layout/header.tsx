"use client";
import { usePathname } from "next/navigation";
import classes from "./header.module.scss";
import GlobalFilter from "../common/globalFilter/globalFilter";
import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { isSidebarOpenAtom } from "../../lib/layout/atom/atom";
import { layoutList } from "./layout";

const Header = () => {
  const pathName = usePathname();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  /* ATOM */
  const [isSidebarOpen, setIsSidebarOpen] = useAtom(isSidebarOpenAtom);
  /* ATOM[E] */
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <header className={classes.header}>
      <div className={classes.textArea}>
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
        <button
          type="button"
          className={classes.filterToggle}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          필터
        </button>{" "}
        <button
          type="button"
          className={classes.menuButton}
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          aria-label="사이드바 열기"
        >
          ☰
        </button>
        <div className={`${classes.panel} ${isOpen ? classes.open : ""}`}>
          <GlobalFilter onClose={() => setIsOpen(false)} />
        </div>
      </div>
    </header>
  );
};

export default Header;
