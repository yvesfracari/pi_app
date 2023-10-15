import { Button, Icon, ListItem } from "@rneui/base";
import { Process, useAppContext } from "../Context";

export default function ProcessStatus({ process }: { process: Process }) {
  const { setPage, setProcessToFinish } = useAppContext();
  return (
    <ListItem key={process.order}>
      <ListItem.Content>
        <ListItem.Title>{process.order}</ListItem.Title>
        <ListItem.Subtitle>
          Estação de trabalho {process.workstation}
        </ListItem.Subtitle>
      </ListItem.Content>
      <Button
        color="#bf2c24"
        onPress={() => {
          setPage("FinishProcess");
          setProcessToFinish(process);
        }}
        icon={<Icon name="close" size={15} color="white" />}
      />
    </ListItem>
  );
}
