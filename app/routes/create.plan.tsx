import {
  Autocomplete,
  AutocompleteItem,
  Card,
  Select,
  SelectItem,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { Container } from "~/components/Container";
import { LilHeader } from "~/components/LilHeader";
import { Photos, TimeGenerationProps, useProjectStore } from "~/store/store";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import { Button, DayPicker, DayProps, useDayRender } from "react-day-picker";
import { da } from "date-fns/locale";
import { Key } from "lucide-react";

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

const TimePicker = (props: TimePickerProps) => {
  const { selectedTimeKey, setSelectedTimeKey } = props;
  return (
    <Select
      selectedKeys={new Set([selectedTimeKey.toString()])}
      color={"default"}
      // defaultItems={timeSlots}
      // onSelectionChange={(item) => {
      //   console.log(item.valueOf());
      //   setSelectedTimeKey(item.valueOf());
      // }}
      // value={selectedTimeKey}
      onChange={(e) => {
        console.log(typeof e.target.value);
        setSelectedTimeKey(Number(e.target.value));
      }}
      variant="faded"
      placeholder="Vælg tidspunkt"
      // allowsCustomValue={false}
      className=""
    >
      {timeSlots.map((item) => (
        <SelectItem key={item.key}>{item.label}</SelectItem>
      ))}
    </Select>
  );
};

const daysOfWeek = [
  { key: 0, label: "Mandag" },
  { key: 1, label: "Tirsdag" },
  { key: 2, label: "Onsdag" },
  { key: 3, label: "Torsdag" },
  { key: 4, label: "Fredag" },
  { key: 5, label: "Lørdag" },
  { key: 6, label: "Søndag" },
];

// Takes in the generationProps and the number of images to be sent
// returns an array of dates for when the images will be sent
const planImageSchedule = (
  generationProps: TimeGenerationProps,
  numImages: number,
): Date[] => {
  const { interval, startDate, sendHour } = generationProps;
  const dates = [];
  if (interval === "daily") {
    for (let i = 0; i < numImages; i++) {
      const date = dayjs(startDate).add(i, "day").hour(sendHour).minute(0);
      dates.push(date.toDate());
    }
  } else if (interval === "weekly") {
    for (let i = 0; i < numImages; i++) {
      const date = dayjs(startDate).add(i, "week").hour(sendHour).minute(0);
      dates.push(date.toDate());
    }
  }
  return dates;
};

type CalenderPlannerProps = {
  generationProps: TimeGenerationProps;
  setSelectedDay: (date: Date) => void;
  photos: Photos[];
};

function DayWithShiftKey(props: DayProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dayRender = useDayRender(props.date, props.displayMonth, buttonRef);

  const index = dayRender.selectedDays?.findIndex((date) =>
    dayjs(date).isSame(props.date, "day"),
  );
  const photo = useProjectStore((state) => state.draft.photos[index]);

  if (!dayRender.isButton) {
    return <div {...dayRender.divProps} />;
  }

  return (
    <div className="relative">
      {dayRender.activeModifiers.selected && (
        <img
          // src={"https://ucarecdn.com/7661c913-13ea-4b32-bc80-691d78c49a4c/-/preview/100x100/"}
          src={photo?.url + "/-/preview/100x100/"}
          alt=""
          className="absolute left-0 top-0 h-10 w-10 rounded-full brightness-75 filter"
        />
      )}
      <Button {...dayRender.buttonProps} ref={buttonRef} />
    </div>
  );
}

const CalenderPlanner = (props: CalenderPlannerProps) => {
  const { generationProps, setSelectedDay, photos } = props;

  const { interval, startDate, sendHour } = generationProps;
  const plan = planImageSchedule(generationProps, photos.length);

  const lastDate = plan[plan.length - 1];

  const footer = startDate ? (
    <div className="pt-4">
      <p>Sender første foto</p>
      <b>{dayjs(startDate).format("D. MMM YY")}</b>
      <p className="pt-4">Sender sidste foto</p>
      <b>{dayjs(lastDate).format("D. MMM YY")}</b>
    </div>
  ) : (
    <p>Please pick a day.</p>
  );

  return (
    <Card className="inline-flex items-center">
      <DayPicker
        fromDate={dayjs().toDate()}
        // className="w-full"
        mode="multiple"
        selected={plan}
        // month={dayjs(startDate).month()}
        locale={da}
        fixedWeeks
        pagedNavigation={false}
        showOutsideDays
        components={{
          Day: (props) => <DayWithShiftKey {...props} startDate={startDate} />,
          // Day: ({ displayMonth, date, selected }) => {
          //   const buttonRef = useRef<HTMLButtonElement>(null);

          //   const dayRender = useDayRender(date, displayMonth, buttonRef);

          //   return (
          //     <button
          //       ref={buttonRef}
          //       onClick={dayRender.buttonProps?.onClick}
          //       className={`${
          //         selected ? "bg-primary-500" : "bg-primary-100"
          //       } h-10 w-10 cursor-pointer rounded-full p-2 `}
          //     >
          //       {dayjs(date).format("D")}
          //     </button>
          //   );
          // },
        }}
        // onSelect={(day) => setSelectedDay(dayjs(day).toDate())}
        footer={footer}
        onDayClick={(day) => setSelectedDay(dayjs(day).toDate())}
      />
    </Card>
  );
};

export default function CreatePlan() {
  const generationProps = useProjectStore(
    (store) => store.draft.generationProps,
  );
  const photos = useProjectStore((store) => store.draft.photos);

  const { editGenerationProps } = useProjectStore();

  return (
    <Container>
      <div className="flex max-w-sm flex-col gap-8">
        <div>
          <LilHeader>Send ét foto</LilHeader>
          <Tabs
            aria-label="Options"
            color="primary"
            size="lg"
            // variant=""
            selectedKey={generationProps.interval}
            onSelectionChange={(key) => {
              if (key !== undefined) {
                editGenerationProps({ interval: key });
              }
            }}
          >
            <Tab key="daily" title="Daglig" />
            <Tab key="weekly" title="Ugenlig" />
          </Tabs>
        </div>
        <div>
          <LilHeader>
            Hver{" "}
            {generationProps.interval === "daily"
              ? "dag"
              : daysOfWeek[dayjs(generationProps?.startDate).day]}{" "}
            Klokken
          </LilHeader>
          <TimePicker
            selectedTimeKey={generationProps.sendHour}
            setSelectedTimeKey={(key) => {
              editGenerationProps({ sendHour: key });
            }}
          />
        </div>
        <div>
          <LilHeader>Start dato </LilHeader>
          <CalenderPlanner
            photos={photos}
            generationProps={generationProps}
            setSelectedDay={(date) => editGenerationProps({ startDate: date })}
          />

          {/* <p className="text-md text-center font-semibold">
          kh sender et billede hver {generationProps.interval} kl{" "}
          {generationProps.sendHour}
        </p> */}
        </div>
      </div>

      {/* {JSON.stringify(generationProps)} */}
    </Container>
  );
}
