import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "@fluentui/react-components";
import { DataTable } from "./DataTable";
import { css } from "@emotion/react";
import { Select } from "@fluentui/react-components";
import { CalendarMonthRegular } from "@fluentui/react-icons";

const styles = css`
  select {
    color: red;
  }
`;

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

  async function getKansouMe() {
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
                css={styles}
                style={{ justifyContent: "flex-end" }}
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
              <Button
                appearance="primary"
                icon={<CalendarMonthRegular />}
                onClick={() => getKansouMe()}
              >
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
