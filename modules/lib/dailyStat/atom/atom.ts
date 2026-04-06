import { DailyStatSummaryType } from "@/types/dailyStat";
import { atom } from "jotai";
export interface DailyStatAtomType {
  name: string;
  data: DailyStatSummaryType[];
}
export const dailyStatAtom = atom<DailyStatAtomType[]>([]);
