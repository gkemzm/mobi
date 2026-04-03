import { DailyStatSummary } from "@/types/marketing";
import { atom } from "jotai";
export interface DailyStatAtomType {
  name: string;
  data: DailyStatSummary[];
}
export const dailyStatAtom = atom<DailyStatAtomType[]>([]);
