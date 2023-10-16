import { useState } from "react";
import { SelectList } from "react-native-dropdown-select-list";

export default function Select({
  setValue,
  items,
  placeholder,
}: {
  setValue: (value: any) => void;
  items: any[];
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <SelectList
      search={false}
      placeholder={placeholder}
      setSelected={setValue}
      save="key"
      data={items}
    />
  );
}
