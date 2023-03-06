import { invoke } from "@tauri-apps/api";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { DataTable } from "../../../components/DataTable";
import {
  currentSeasonIndexState,
  currentSeasonState,
  seasonDataState,
} from "../../../store/bangumi";

export type BangumiData = {
  date: string;
  title: string;
  broadcast_station: string[];
};

export type Season = {
  title: string;
  data: BangumiData[];
};

export function LeftPanel() {
  const currentIndex = useRecoilValue(currentSeasonIndexState);
  const setSeasonData = useSetRecoilState(seasonDataState);
  const currentSeason = useRecoilValue(currentSeasonState);

  async function getKansouMe() {
    invoke("get_window_label");

    const result: Season[] = await invoke("get_kansou");
    setSeasonData(result);
    return result;
  }

  useEffect(() => {
    getKansouMe();
    console.log("update");
  }, [currentIndex]);

  useEffect(() => {
    getKansouMe();
    console.log("main first render");
  }, []);

  return <DataTable items={currentSeason?.data ?? []}></DataTable>;
}
