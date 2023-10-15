import { View, Image } from "react-native";
import { Button, Card, Icon, Text } from "@rneui/base";
import ProcessStatus from "../components/ProcessStatus";
import { useAppContext } from "../Context";

export default function Home() {
  const { onGoingProcesses, setPage } = useAppContext();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image
        source={require("../assets/logo.png")}
        style={{ marginBottom: 10 }}
      />
      <Button
        icon={<Icon name="forward" size={15} color="white" />}
        title="Novo processo"
        style={{ marginBottom: 200 }}
        onPress={() => setPage("StartProcess")}
      />
      <Card>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              textAlignVertical: "center",
              marginRight: 10,
            }}
          >
            Processos em andamento
          </Text>
          <Button icon={<Icon name="replay" size={15} color="white" />} />
        </View>
        <Card.Divider />
        <View>
          {onGoingProcesses.map((process) => (
            <View key={process.order}>
              <ProcessStatus process={process} />
            </View>
          ))}
        </View>
      </Card>
    </View>
  );
}
