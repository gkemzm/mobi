import { PlatformPerformanceResponseType } from "@/types/platform";
import { atom } from "jotai";

export const platformPerformanceAtom = atom<PlatformPerformanceResponseType>({
  metric: "cost",
  total: 0,
  items: [],
});
