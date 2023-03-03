import { teamsLightTheme } from "@fluentui/react-components";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const darkModeState = atom({
  key: "darkModeState",
  default: {
    systemTheme: "light",
    autoDarkmode: true,
    theme: teamsLightTheme,
  },
  effects_UNSTABLE: [persistAtom],
});
