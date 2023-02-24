import { useEffect } from "react";
import { css } from "@emotion/react";
import MyAppMain from "../components/App";

const Home = () => {
  async function setupAppWindow() {
    const appWindow = (await import("@tauri-apps/api/window")).appWindow;
    appWindow.show();
  }

  useEffect(() => {
    setupAppWindow();
  }, []);

  return (
    <div style={{ padding: "12px", minHeight: "100vh" }}>
      <MyAppMain></MyAppMain>
    </div>
  );
};

export default Home;
