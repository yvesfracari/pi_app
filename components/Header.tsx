import { Header as HeaderPrimitive } from "@rneui/themed";
import { useAppContext } from "../Context";

export default function Header() {
  const { setPage } = useAppContext();
  return (
    <HeaderPrimitive
      rightComponent={{
        icon: "home",
        color: "#fff",
        onPress: () => setPage("Home"),
      }}
      centerComponent={{ text: "ARTTS", style: { color: "#fff" } }}
    />
  );
}
