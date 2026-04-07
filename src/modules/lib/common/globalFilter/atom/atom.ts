import { GlobalFilterState } from "@/modules/components/common/globalFilter/type";
import { getInitialGlobalFilter } from "@/modules/components/common/globalFilter/util";
import { atom } from "jotai";

export const globalFilterValueAtom = atom<GlobalFilterState>(
  getInitialGlobalFilter()
);
