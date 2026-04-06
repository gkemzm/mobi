import { PlatformPerformanceResponse } from "@/types/platform";
import { atom } from "jotai";

export const platformPerformanceAtom = atom<PlatformPerformanceResponse>({
  metric: "cost",
  total: 0,
  items: [],
});
