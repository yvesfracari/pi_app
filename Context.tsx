import { createContext, PropsWithChildren, useContext, useState } from "react";

export type Process = {
  order: string;
  produced: number;
  total: number;
  workstation?: number;
  referenceTime: number;
  realTime?: number;
  part: string;
  status?: string;
};

export type Workstation = {
  id: number;
  name: string;
};

interface AppContextType {
  page: string;
  setPage: (page: string) => void;
  processToFinish: Process | null;
  setProcessToFinish: (process: Process) => void;
  onGoingProcesses: Process[];
  setOngoingProcesses: (processes: Process[]) => void;
  processesWaiting: Process[];
  setProcessesWaiting: (process: Process[]) => void;
  passProcessFromWaitingToOngoing: (process: Process) => void;
  passProcessFromOnGoingToWaiting: (process: Process) => void;
  finalizeProcess: (process: Process) => void;
  updateProcessProduced: (process: Process, correctProduced: number) => Process;
  availableWorkstations: Workstation[];
  updateProcessWorkstation: (
    process: Process,
    workstation: Workstation
  ) => Process;
  updateOnGoingProcess: () => void;
  updateAvailableWorkstations: () => void;
  updateWaitingProcess: () => void;
}

export const serverURL = "http://192.168.0.7:8000";

export const AppContext = createContext({} as AppContextType);

// @ts-ignore
export function AppContextProvider({ children }: PropsWithChildren) {
  const [page, setPage] = useState("Home");
  const [processToFinish, setProcessToFinish] = useState<Process | null>(null);
  const [onGoingProcesses, setOngoingProcesses] = useState<Process[]>([]);
  const [availableWorkstations, setAvailableWorkstations] = useState<
    Workstation[]
  >([]);

  const updateAvailableWorkstations = () => {
    fetch(serverURL + "/available_workstations")
      .then((response) => response.json())
      .then((response) => {
        setAvailableWorkstations(
          response.map((workstation: number) => ({
            id: workstation,
            name: `Estação ${workstation}`,
          }))
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const getOnGoingProcess = () => {
    return fetch(serverURL + "/producing_orders")
      .then((response) => response.json())
      .catch((error) => {
        console.error(error);
      });
  };

  const updateOnGoingProcess = () => {
    getOnGoingProcess().then((response) => {
      setOngoingProcesses(response);
    });
  };

  const updateWaitingProcess = () => {
    fetch(serverURL + "/waiting_orders")
      .then((response) => response.json())
      .then((response) => {
        setProcessesWaiting(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const [processesWaiting, setProcessesWaiting] = useState<Process[]>([]);

  function passProcessFromWaitingToOngoing(process: Process) {
    fetch(serverURL + "/producing_orders", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...process,
        status: "producing",
      }),
    });
  }

  function passProcessFromOnGoingToWaiting(process: Process) {
    fetch(serverURL + "/producing_orders", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...process,
        status: "stopped",
      }),
    });
  }

  function finalizeProcess(process: Process) {
    fetch(serverURL + "/producing_orders", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...process,
        status: "finished",
      }),
    });
  }

  function updateProcessProduced(
    process: Process,
    correctProduced: number
  ): Process {
    const updatedProcessRealTime =
      ((process.realTime || 0) * process.produced) / correctProduced;
    return {
      ...process,
      realTime: updatedProcessRealTime,
      produced: correctProduced,
    };
  }

  function updateProcessWorkstation(
    process: Process,
    workstation: Workstation
  ): Process {
    return {
      ...process,
      workstation: workstation.id,
    };
  }

  return (
    <AppContext.Provider
      value={{
        page,
        setPage,
        processToFinish,
        setProcessToFinish,
        onGoingProcesses,
        setOngoingProcesses,
        processesWaiting,
        setProcessesWaiting,
        passProcessFromWaitingToOngoing,
        passProcessFromOnGoingToWaiting,
        finalizeProcess,
        updateProcessProduced,
        availableWorkstations,
        updateProcessWorkstation,
        updateOnGoingProcess,
        updateAvailableWorkstations,
        updateWaitingProcess,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  return context;
}
