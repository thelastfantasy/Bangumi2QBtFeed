import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import { IColumn, mergeStyleSets } from "@fluentui/react";
import { DataTable } from "./DataTable";
import { Select } from "@fluentui/react-components";

const classNames = mergeStyleSets({
  fileIconHeaderIcon: {
    padding: 0,
    fontSize: "16px",
  },
  fileIconCell: {
    textAlign: "center",
    selectors: {
      "&:before": {
        content: ".",
        display: "inline-block",
        verticalAlign: "middle",
        height: "100%",
        width: "0px",
        visibility: "hidden",
      },
    },
  },
  fileIconImg: {
    verticalAlign: "middle",
    maxHeight: "16px",
    maxWidth: "16px",
  },
  controlWrapper: {
    display: "flex",
    flexWrap: "wrap",
  },
  exampleToggle: {
    display: "inline-block",
    marginBottom: "10px",
    marginRight: "30px",
  },
  selectionDetails: {
    marginBottom: "20px",
  },
});

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
    <div className="App">
      <h2>番组信息</h2>
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
            <PrimaryButton
              text={`获取番组信息`}
              onClick={() => getKansouMe()}
            />
          </div>
        </div>
        <div>
          <DataTable items={currentSeason?.data ?? []}></DataTable>
        </div>
      </div>
    </div>
  );
}

export default MyAppMain;
