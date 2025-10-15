"use client";

import { atom } from "jotai";

import { ActivityCategory, ActivitySort } from "./types";

export const activityMethodAtom = atom<"cursor" | "offset">("cursor");

export const activityCursorIdAtom = atom<number | undefined>(undefined);

export const activityPageAtom = atom<number>(1);
export const activitySizeAtom = atom<number>(6);

export const activityCategoryAtom = atom<ActivityCategory | undefined>(undefined);
export const activityKeywordAtom = atom<string>("");
export const activitySortAtom = atom<ActivitySort>("most_reviewed");
