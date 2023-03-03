import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Button, useId } from "@fluentui/react-components";
import { DataTable } from "./DataTable";
import { Select } from "@fluentui/react-components";
import { MoviesAndTv16Filled as BtnIcon } from "@fluentui/react-icons";
import { useDarkMode } from "../hooks";
import { InnerMoon } from "@theme-toggles/react";
import { useRecoilValue } from "recoil";
import { darkModeState } from "../store";

export type BangumiData = {
  date: string;
  title: string;
  broadcast_station: string[];
};

type Season = {
  title: string;
  data: BangumiData[];
};

function MyAppMain() {
  const [data, setData] = useState<Season[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentSeason, setCurrentSeason] = useState<Season | null>(data[0]);
  const selectId = useId();
  const { setMode } = useDarkMode();
  const { systemTheme } = useRecoilValue(darkModeState);

  async function getKansouMe() {
    invoke("get_window_label");

    const result: Season[] = await invoke("get_kansou");
    setData(result);
    setCurrentSeason(result[currentIndex]);
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

  return (
    <>
      <div className="App">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <div>
            <InnerMoon
              reversed
              style={{
                fontSize: "20px",
                color: systemTheme === "dark" ? "rgb(248, 215, 20)" : "black",
                // color: "rgb(248, 215, 20)",
              }}
              toggled={systemTheme === "dark"}
              onToggle={(toggled) => {
                setMode(toggled ? "dark" : "light");
              }}
            />
          </div>
        </div>
        <h2 style={{ textAlign: "center" }}>番组信息</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <div style={{ paddingBottom: "8px", display: "flex", gap: "4px" }}>
            <div>
              <Select
                id={selectId}
                // css={styles}
                // style={{ justifyContent: "flex-end" }}
                value={currentIndex}
                onChange={(_e, data) => setCurrentIndex(Number(data.value))}
              >
                {data.map((season, index) => (
                  <option key={index} value={index}>
                    {season.title}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Button appearance="primary" icon={<BtnIcon />} onClick={() => getKansouMe()}>
                获取番组信息
              </Button>
            </div>
          </div>
          <div>
            <DataTable items={currentSeason?.data ?? []}></DataTable>
          </div>
        </div>
      </div>
    </>
  );
}

export default MyAppMain;
