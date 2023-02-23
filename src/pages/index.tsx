import { useEffect } from "react";
import MyAppMain from "../components/App";

const Home = () => {
  async function setupAppWindow() {
    const appWindow = (await import("@tauri-apps/api/window")).appWindow;
    appWindow.show();
  }

  useEffect(() => {
    setupAppWindow();
  }, []);

  return <MyAppMain></MyAppMain>;
};

export default Home;
