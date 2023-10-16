import React, { useEffect } from "react";
import Header from "./components/Header";
import { AppContextProvider, useAppContext } from "./Context";
import Home from "./pages/Home";
import FinishProcess from "./pages/FinishProcess";
import StartProcess from "./pages/StartProcess";
import { BackHandler } from "react-native";

export default function App() {
  return (
    <AppContextProvider>
      <Layout />
    </AppContextProvider>
  );
}

function Layout() {
  const { page, setPage } = useAppContext();

  useEffect(() => {
    const backAction = () => {
      if (page === "Home") {
        BackHandler.exitApp();
      } else {
        setPage("Home");
      }
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [page]);

  return (
    <>
      <Header />
      {page === "Home" && <Home />}
      {page === "FinishProcess" && <FinishProcess />}
      {page === "StartProcess" && <StartProcess />}
    </>
  );
}
