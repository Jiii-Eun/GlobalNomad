"use client";

import { atom } from "jotai";

import { ActivityCategory, ActivitySort } from "./types";

export const activityMethodAtom = atom<"cursor" | "offset">("cursor");

export const activityPageAtom = atom<number>(1);
export const activitySizeAtom = atom<number>(8);

export const activityCategoryAtom = atom<ActivityCategory | undefined>(undefined);
export const activityKeywordAtom = atom<string | undefined>(undefined);
export const activitySortAtom = atom<ActivitySort>("latest");
