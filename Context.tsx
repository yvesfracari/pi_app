import { createContext, PropsWithChildren, useContext, useState } from "react";

export type Process = {
  order: string;
  produced: number;
  total: number;
  workstation?: number;
  referenceTime: number;
  realTime?: number;
  part: string;
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
  updateProcessProduced: (process: Process, correctProduced: number) => void;
  availableWorkstations: Workstation[];
  updateProcessWorkstation: (
    process: Process,
    workstation: Workstation
  ) => void;
}

export const AppContext = createContext({} as AppContextType);

// @ts-ignore
export function AppContextProvider({ children }: PropsWithChildren) {
  const [page, setPage] = useState("Home");
  const [processToFinish, setProcessToFinish] = useState<Process | null>(null);
  const [onGoingProcesses, setOngoingProcesses] = useState<Process[]>([
    {
      order: "ORD-0001",
      produced: 100,
      total: 1000,
      workstation: 1,
      realTime: 20,
      referenceTime: 30,
      part: "PLC-0001",
    },
    {
      order: "ORD-0002",
      produced: 300,
      total: 500,
      workstation: 2,
      realTime: 30,
      referenceTime: 30,
      part: "PLC-0212",
    },
    {
      order: "ORD-0003",
      produced: 200,
      total: 500,
      workstation: 3,
      realTime: 50,
      referenceTime: 20,
      part: "PLC-0212",
    },
  ]);

  const [processesWaiting, setProcessesWaiting] = useState<Process[]>([
    {
      order: "ORD-0004",
      produced: 0,
      total: 500,
      workstation: 3,
      referenceTime: 20,
      part: "PLC-0212",
    },
    {
      order: "ORD-0005",
      produced: 0,
      total: 500,
      referenceTime: 20,
      part: "PLC-0212",
    },
    {
      order: "ORD-0006",
      produced: 100,
      total: 500,
      realTime: 10,
      referenceTime: 20,
      part: "PLC-0212",
    },
  ]);

  const availableWorkstations = [
    {
      id: 1,
      name: "Estação 1",
    },
    {
      id: 2,
      name: "Estação 2",
    },
    {
      id: 3,
      name: "Estação 3",
    },
  ];

  function passProcessFromWaitingToOngoing(process: Process) {
    setOngoingProcesses([...onGoingProcesses, process]);
    setProcessesWaiting(
      processesWaiting.filter((p) => p.order !== process.order)
    );
  }

  function passProcessFromOnGoingToWaiting(process: Process) {
    setProcessesWaiting([...processesWaiting, process]);
    setOngoingProcesses(
      onGoingProcesses.filter((p) => p.order !== process.order)
    );
  }

  function finalizeProcess(process: Process) {
    setOngoingProcesses(
      onGoingProcesses.filter((p) => p.order !== process.order)
    );
  }

  function updateProcessProduced(process: Process, correctProduced: number) {
    const updatedProcessRealTime =
      ((process.realTime || 0) * process.produced) / correctProduced;
    const newProcess = {
      ...process,
      realTime: updatedProcessRealTime,
      produced: correctProduced,
    };
    setOngoingProcesses(
      onGoingProcesses.map((p) => (p.order === process.order ? newProcess : p))
    );
  }

  function updateProcessWorkstation(
    process: Process,
    workstation: Workstation
  ) {
    const newProcess = {
      ...process,
      workstation: workstation.id,
    };
    setOngoingProcesses(
      onGoingProcesses.map((p) => (p.order === process.order ? newProcess : p))
    );
    setProcessesWaiting(
      processesWaiting.map((p) => (p.order === process.order ? newProcess : p))
    );
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
