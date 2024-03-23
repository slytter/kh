import { Select, SelectItem } from "@nextui-org/react";
import dayjs from "dayjs";

const format = "H:mm";

const timeSlots = Array.from({ length: 24 }, (_, i) => ({
  key: i,
  value: i,
  label: dayjs().hour(i).minute(0).format(format),
}));

type TimePickerProps = {
  selectedTimeKey: number;
  setSelectedTimeKey: (key: number) => void;
};

export const TimePicker = (props: TimePickerProps) => {
  const { selectedTimeKey, setSelectedTimeKey } = props;
  return (
    <Select
      selectedKeys={new Set([selectedTimeKey.toString()])}
      color={"default"}
      onChange={(e) => {
        setSelectedTimeKey(Number(e.target.value));
      }}
      variant="faded"
      placeholder="Vælg tidspunkt"
      className=""
    >
      {timeSlots.map((item) => (
        <SelectItem key={item.key}>{item.label}</SelectItem>
      ))}
    </Select>
  );
};
