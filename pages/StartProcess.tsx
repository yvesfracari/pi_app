import { Button, Card, Icon, ListItem } from "@rneui/base";
import { useEffect, useState } from "react";
import Select from "../components/Select";
import { Process, useAppContext, Workstation } from "../Context";
import { View, Text } from "react-native";
import ConfirmDialog from "../components/ConfirmDialog";

export default function StartProcess() {
  const {
    processesWaiting,
    availableWorkstations,
    passProcessFromWaitingToOngoing,
    updateProcessWorkstation,
    setPage,
  } = useAppContext();
  const [processName, setProcessName] = useState<string | null>(null);
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [workstation, setWorkstation] = useState<Workstation | null>(null);
  const [workstationName, setWorkstationName] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  useEffect(() => {
    if (processName) {
      const process = processesWaiting.find(
        (process) => process.order === processName
      );
      if (process) {
        setSelectedProcess(process);
      }
    }
  }, [processName, processesWaiting]);

  useEffect(() => {
    if (workstationName) {
      const workstation = availableWorkstations.find(
        (availableWorkstation) => availableWorkstation.name === workstationName
      );
      if (workstation) {
        setWorkstation(workstation);
      }
    }
  }, [workstationName, availableWorkstations]);

  return (
    <Card>
      <ConfirmDialog
        visible={confirmDialogOpen}
        onCancel={() => setConfirmDialogOpen(false)}
        onConfirm={() => {
          setConfirmDialogOpen(false);
          if (selectedProcess && workstation) {
            updateProcessWorkstation(selectedProcess, workstation);
            passProcessFromWaitingToOngoing(selectedProcess);
            setPage("Home");
          }
        }}
      />
      <Card.Title h3>Novo processo</Card.Title>
      <Card.Title h4>Estação de trabalho</Card.Title>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <View style={{ flex: 1 }}>
          <Select
            items={availableWorkstations.map((workstation) => ({
              key: workstation.name,
              value: workstation.name,
            }))}
            setValue={setWorkstationName}
            placeholder="Selecione a estação de trabalho"
          />
        </View>
        <View style={{ padding: 5 }}>
          <Button icon={<Icon name="replay" size={20} color="white" />} />
        </View>
      </View>
      <Card.Title h4>Ordem de serviço</Card.Title>
      <Select
        items={processesWaiting.map((process) => ({
          key: process.order,
          value: process.order,
        }))}
        placeholder="Selecione uma ordem de serviço"
        setValue={setProcessName}
      />
      <Card.Divider />
      {processName && (
        <View>
          <ListItem>
            <ListItem.Content>
              <ListItem.Title>Peça</ListItem.Title>
              <ListItem.Subtitle>{selectedProcess?.part}</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Content>
              <ListItem.Title>Tempo por peça</ListItem.Title>
              <ListItem.Subtitle>
                {selectedProcess?.referenceTime}
              </ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
          <ListItem>
            <ListItem.Content>
              <ListItem.Title>Total de items</ListItem.Title>
              <ListItem.Subtitle>{selectedProcess?.total}</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Content>
              <ListItem.Title>Itens já finalizados</ListItem.Title>
              <ListItem.Subtitle>{selectedProcess?.produced}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        </View>
      )}
      <Card.Divider />
      <Button
        title="Iniciar processo"
        color="success"
        onPress={() => setConfirmDialogOpen(true)}
        disabled={!processName || !workstationName}
      />
    </Card>
  );
}
