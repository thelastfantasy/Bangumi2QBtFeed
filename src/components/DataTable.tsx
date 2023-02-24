import {
  TableBody,
  TableCell,
  TableRow,
  Table,
  TableHeader,
  TableHeaderCell,
  TableCellLayout,
} from "@fluentui/react-components";
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
            <TableCell>{item.title}</TableCell>
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
