import { DailyStatSummary } from "@/types/dailyStat";
import { atom } from "jotai";
export interface DailyStatAtomType {
  name: string;
  data: DailyStatSummary[];
}
export const dailyStatAtom = atom<DailyStatAtomType[]>([]);
