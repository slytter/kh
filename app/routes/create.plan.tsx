import {Tab, Tabs} from "@nextui-org/react";
import {BottomNav} from "../components/BottomNav.js";
import {LilHeader} from "../components/LilHeader.js";
import {CalenderPlanner} from "../components/planning/CalenderPlanner.js";
import {TimePicker} from "../components/planning/TimePicker.js";
import {useProjectStore} from "../store/store.js";
import dayjs from "dayjs";

const weekDays = ["søndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag"];

export default function CreatePlan() {
  const generationProps = useProjectStore(
    (store) => store.draft.generationProps,
  );
  const photos = useProjectStore((store) => store.draft.photos);
  const { editGenerationProps } = useProjectStore();

  const canContinue = generationProps.startDate !== undefined

  if(photos.length === 0) {
    return (
      <>
        <div className="flex flex-col gap-8">
          <p className="text-center">
            Du har ikke uploadet nogen billeder endnu. Gå tilbage og upload et billede.
          </p>
        </div>
        <BottomNav route="/create/upload" title={"Upload"} />
      </>
    )
  }

  return (
    <div className={"min-h-dvh flex flex-col justify-between"}>
      <div className="flex max-w-sm flex-col gap-8">
        <div>
          <LilHeader>Send ét foto</LilHeader>
          <Tabs
            aria-label="Options"
            color="primary"
            size="lg"
            selectedKey={generationProps.interval}
            onSelectionChange={(key) => {
              if (key !== undefined && typeof key === "string") {
                editGenerationProps({interval: key});
              }
            }}
          >
            <Tab key="daily" title="Daglig"/>
            <Tab key="weekly" title="Ugenlig"/>
          </Tabs>
        </div>
        <div>
          <LilHeader>Start dato </LilHeader>
          <CalenderPlanner
            photos={photos}
            generationProps={generationProps}
            setSelectedDay={(date) => editGenerationProps({startDate: date})}
          />

          {/* <p className="text-md text-center font-semibold">
          kh sender et billede hver {generationProps.interval} kl{" "}
          {generationProps.sendHour}
        </p> */}
        </div>
        <div>
          <LilHeader>
            Hver {generationProps.interval === "daily" ? "dag" : weekDays[dayjs(generationProps.startDate).day()] || 'uge'} klokken
          </LilHeader>
          <TimePicker
            selectedTimeKey={generationProps.sendHour}
            setSelectedTimeKey={(key) => {
              editGenerationProps({sendHour: key});
            }}
          />
        </div>
      </div>

      <BottomNav disabled={!canContinue} route="/create/receivers" title={"Modtagere"}/>
    </div>
  );
}
