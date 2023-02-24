import { useEffect, useState } from 'react';
import { teamsLightTheme, teamsDarkTheme } from "@fluentui/react-components";

export function useDarkMode() {
    const [systemTheme, setSystemTheme] = useState("");
    const [theme, setTheme] = useState(teamsLightTheme);

    useEffect(() => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setSystemTheme('dark');
        } else {
            setSystemTheme('light');
        }

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const listener = (e: MediaQueryListEvent) => setSystemTheme(e.matches ? 'dark' : 'light');

        mediaQuery.addEventListener('change', listener);
        return () => mediaQuery.removeEventListener('change', listener);
    }, []);

    useEffect(() => {
        if (systemTheme === 'dark') {
            setTheme(teamsDarkTheme);
        } else {
            setTheme(teamsLightTheme);
        }
    }, [systemTheme]);

    return { isDarkMode: systemTheme === 'dark', theme };
}