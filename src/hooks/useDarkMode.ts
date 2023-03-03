import { useEffect, useState } from "react";
import { teamsLightTheme, teamsDarkTheme } from "@fluentui/react-components";
import { useSetRecoilState } from "recoil";
import { darkModeState } from "../store";

export function useDarkMode() {
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light");
  const [theme, setTheme] = useState(teamsLightTheme);
  const [autoDarkmode, setAutoDarkmode] = useState(true);
  const setDarkMode = useSetRecoilState(darkModeState);

  const setMode = (mode: "dark" | "light") => {
    setAutoDarkmode(false);
    setTheme(mode === "dark" ? teamsDarkTheme : teamsLightTheme);
    updateSyetemTheme(mode);
  };

  function updateSyetemTheme(mode: "dark" | "light") {
    setDarkMode((oldState: any) => ({
      ...oldState,
      systemTheme: mode,
    }));
  }

  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setSystemTheme("dark");
    } else {
      setSystemTheme("light");
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (e: MediaQueryListEvent) => setSystemTheme(e.matches ? "dark" : "light");

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  useEffect(() => {
    if (autoDarkmode) {
      if (systemTheme === "dark") {
        setTheme(teamsDarkTheme);
      } else {
        setTheme(teamsLightTheme);
      }
    }
  }, [systemTheme, autoDarkmode]);

  return {
    isDarkMode: systemTheme === "dark",
    theme,
    setAutoDarkmode,
    setMode,
  };
}
