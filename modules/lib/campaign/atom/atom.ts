import { Campaign } from "@/types/marketing";
import { atom } from "jotai";

export const campaignsAtom = atom<Campaign[]>([]);
