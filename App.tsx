import React from "react";
import Header from "./components/Header";
import { AppContextProvider, useAppContext } from "./Context";
import Home from "./pages/Home";
import FinishProcess from "./pages/FinishProcess";
import StartProcess from "./pages/StartProcess";

export default function App() {
  return (
    <AppContextProvider>
      <Layout />
    </AppContextProvider>
  );
}

function Layout() {
  const { page } = useAppContext();
  return (
    <>
      <Header />
      {page === "Home" && <Home />}
      {page === "FinishProcess" && <FinishProcess />}
      {page === "StartProcess" && <StartProcess />}
    </>
  );
}
