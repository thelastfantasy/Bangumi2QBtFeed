import {
  TableBody,
  TableCell,
  TableRow,
  Table,
  TableHeader,
  TableHeaderCell,
  TableCellLayout,
  Button,
  Tooltip,
} from "@fluentui/react-components";
import { useEffect } from "react";
import { useDarkMode } from "../hooks";
import { Copy16Regular as CopyIcon } from "@fluentui/react-icons";

import { writeText } from "@tauri-apps/api/clipboard";

import { BangumiData } from "./App";

type Props = {
  items: BangumiData[];
};

const columns = [
  { key: "date", name: "放送開始日", minWidth: 120 },
  { key: "title", name: "作品タイトル", minWidth: 400 },
  { key: "broadcast_station", name: "放送局/放送日時", minWidth: 120 },
];

export const DataTable = ({ items }: Props) => {
  return (
    <Table arial-label="Data table">
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHeaderCell key={column.key}>{column.name}</TableHeaderCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item, index) => (
          <TableRow key={index} style={{ textAlign: "left" }}>
            <TableCell>
              <TableCellLayout>{item.date}</TableCellLayout>
            </TableCell>
            <TableCell>
              {item.title}
              <Button
                className="copy-button"
                appearance="transparent"
                icon={<CopyIcon />}
                onClick={() => {
                  writeText(item.title);
                }}
                title="タイトルをコピー"
              />
            </TableCell>
            <TableCell>
              {item.broadcast_station.map((bs, i) => (
                <TableCellLayout key={`${index}-${i}`}>{bs}</TableCellLayout>
              ))}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
