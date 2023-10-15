import { Dialog } from "@rneui/base";

export default function ConfirmDialog({
  visible,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Dialog
      isVisible={visible}
      overlayStyle={{
        borderRadius: 16,
        borderWidth: 1,
        backgroundColor: "white",
      }}
    >
      <Dialog.Title title="Confirmar ação" />
      <Dialog.Actions>
        <Dialog.Button title="Sim" color="success" onPress={onConfirm} />
        <Dialog.Button title="Não" onPress={onCancel} />
      </Dialog.Actions>
    </Dialog>
  );
}
