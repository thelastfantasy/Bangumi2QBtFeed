import { teamsLightTheme } from "@fluentui/react-components";
import { atom } from "recoil";

export const darkModeState = atom({
    key: "darkModeState",
    default: {
        systemTheme: "light",
        autoDarkmode: true,
        theme: teamsLightTheme
    }
});