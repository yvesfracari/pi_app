import React, { useEffect } from "react";
import { useAppContext } from "../Context";
import { View } from "react-native";
import ConfirmDialog from "../components/ConfirmDialog";
import { Button, Card, Icon, Input, ListItem, Text } from "@rneui/base";

export default function FinishProcess() {
  const {
    setPage,
    processToFinish,
    updateProcessProduced,
    passProcessFromOnGoingToWaiting,
    finalizeProcess,
  } = useAppContext();
  const [produced, setProduced] = React.useState<Number>(0);
  const [timeByPart, setTimeByPart] = React.useState<Number>(0);
  const [onConfirm, setOnConfirm] = React.useState<() => void>(() => () => {});
  const [dialogVisible, setDialogVisible] = React.useState<boolean>(false);

  useEffect(() => {
    setProduced(processToFinish?.produced || 0);
    setTimeByPart(processToFinish?.realTime || 0);
  }, []);

  useEffect(() => {
    const realTime =
      ((processToFinish?.realTime || 0) * (processToFinish?.produced || 0)) /
      (produced as number);
    setTimeByPart(realTime);
  }, [produced]);

  if (processToFinish === null) {
    return <Text>Processo não encontrado</Text>;
  }

  return (
    <View>
      <ConfirmDialog
        visible={dialogVisible}
        onConfirm={onConfirm}
        onCancel={() => setDialogVisible(false)}
      />
      <Card>
        <Card.Title h2>{processToFinish?.order}</Card.Title>
        <Card.Title h4>
          Estação de trabalho {processToFinish?.workstation}
        </Card.Title>
        <Card.Title h4>{processToFinish?.part}</Card.Title>
        <ListItem>
          <ListItem.Content>
            <ListItem.Title>Produzido</ListItem.Title>
            <Input
              keyboardType="numeric"
              defaultValue={String(processToFinish?.produced)}
              onChange={(event) => {
                setProduced(Number(event.nativeEvent.text));
              }}
            />
          </ListItem.Content>
        </ListItem>
        <ListItem>
          <ListItem.Content>
            <ListItem.Title>Tempo por peça (segundos)</ListItem.Title>
            <Input
              disabled
              value={`${timeByPart.toFixed(2)} segundos por peça`}
            />
          </ListItem.Content>
        </ListItem>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <View style={{ marginRight: 10 }}>
            <Button
              title="Pausar"
              onPress={() => {
                setDialogVisible(true);
                setOnConfirm(() => () => {
                  const processUpdated = updateProcessProduced(
                    processToFinish,
                    produced as number
                  );
                  passProcessFromOnGoingToWaiting(processUpdated);
                  setPage("Home");
                });
              }}
              color="warning"
              icon={<Icon name="pause" size={15} color="white" />}
              style={{ margin: 30 }}
            />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Button
              onPress={() => {
                setDialogVisible(true);
                setOnConfirm(() => () => {
                  const processUpdated = updateProcessProduced(
                    processToFinish,
                    produced as number
                  );
                  finalizeProcess(processUpdated);
                  setPage("Home");
                });
              }}
              title="Finalizar"
              color="green"
              icon={<Icon name="done" size={15} color="white" />}
              style={{ margin: 30 }}
            />
          </View>
        </View>
        <Card.Divider />
      </Card>
    </View>
  );
}
