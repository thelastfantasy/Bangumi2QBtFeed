import { useRecoilValue } from "recoil";
import { darkModeState } from "../store";

export function Info() {
  const { systemTheme } = useRecoilValue(darkModeState);
  return (
    <>
      <div>
        <p>此处应该随主窗口实时更新</p>
        <p>{systemTheme}</p>
      </div>
    </>
  );
}
