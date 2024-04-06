import { Tab, Tabs } from "@nextui-org/react";
import { BottomNav } from "../components/BottomNav";
import { LilHeader } from "../components/LilHeader.js";
import { CalenderPlanner } from "../components/planning/CalenderPlanner.js";
import { TimePicker } from "../components/planning/TimePicker.js";
import { useProjectStore } from "../store/store.js";
import dayjs from "dayjs";
import { HandHeart } from "lucide-react";

const weekDays = [
  "søndag",
  "mandag",
  "tirsdag",
  "onsdag",
  "torsdag",
  "fredag",
  "lørdag",
];

export default function CreatePlan() {
  const generation_props = useProjectStore(
    (store) => store.draftProject.generation_props,
  );
  const photos = useProjectStore((store) => store.draftPhotos);
  const { editGenerationProps } = useProjectStore();

  const canContinue = !!generation_props.startDate;

  if (photos.length === 0) {
    return (
      <>
        <div className="flex flex-col gap-8">
          <p className="text-center">
            Du har ikke uploadet nogen billeder endnu. Gå tilbage og upload et
            billede.
          </p>
        </div>
        <BottomNav route="/create/upload" title={"Upload"} />
      </>
    );
  }

  return (
    <div className={"flex min-h-dvh flex-col justify-between"}>
      <div className="flex max-w-sm flex-col gap-8">
        <div>
          <LilHeader>Send ét foto</LilHeader>
          <Tabs
            aria-label="Options"
            color="primary"
            size="lg"
            selectedKey={generation_props.interval}
            onSelectionChange={(key) => {
              if (
                (key !== undefined &&
                  typeof key === "string" &&
                  key === "daily") ||
                key === "weekly"
              ) {
                editGenerationProps({ interval: key });
              }
            }}
          >
            <Tab key="daily" title="Daglig" />
            <Tab key="weekly" title="Ugenlig" />
          </Tabs>
        </div>
        <div>
          <LilHeader>Start dato </LilHeader>
          <CalenderPlanner
            photos={photos}
            generation_props={generation_props}
            setSelectedDay={(date) => {
              editGenerationProps({ startDate: new Date(date).getTime() });
            }}
          />

          {/* <p className="text-md text-center font-semibold">
          kh sender et billede hver {generationProps.interval} kl{" "}
          {generationProps.sendHour}
        </p> */}
        </div>
        <div>
          <LilHeader>
            Hver{" "}
            {generation_props.interval === "daily"
              ? "dag"
              : weekDays[dayjs(generation_props.startDate).day()] || "uge"}{" "}
            klokken
          </LilHeader>
          <TimePicker
            selectedTimeKey={generation_props.sendHour}
            setSelectedTimeKey={(key) => {
              editGenerationProps({ sendHour: key });
            }}
          />
        </div>
      </div>

      <BottomNav
        // onClick={}
        disabled={!canContinue}
        disabledReason="Vælg en start dato"
        startContent={<HandHeart />}
        route="/create/receivers"
        title={"Vælg modtagere"}
      />
    </div>
  );
}
