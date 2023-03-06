import { atom, selector } from "recoil";
import { Season } from "../features";

export const seasonDataState = atom({
  key: "seasonData",
  default: [] as Season[],
});

export const currentSeasonIndexState = atom({
  key: "currentSeasonIndex",
  default: 0,
});

export const currentSeasonState = selector({
  key: "currentSeason",
  get: ({ get }) => {
    const index = get(currentSeasonIndexState);
    const list = get(seasonDataState);

    return list[index];
  },
});
