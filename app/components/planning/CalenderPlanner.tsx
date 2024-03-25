import { Card } from "@nextui-org/react";
import { da } from "date-fns/locale";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { Button, DayPicker, DayProps, useDayRender } from "react-day-picker";
import {
  Photo,
  TimeGenerationProps,
  useProjectStore,
} from "../../store/store.js";
import { planPhotoSchedule } from "../../utils/planPhotoSchedule.js";

function DayImageViewer(props: DayProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dayRender = useDayRender(props.date, props.displayMonth, buttonRef);

  const index = dayRender.selectedDays?.findIndex((date) =>
    dayjs(date).isSame(props.date, "day"),
  );

  const photo = useProjectStore((state) => state.draft.photos[index]);

  // const [shouldAnimate, setShouldAnimate] = useState(false);

  // useEffect(() => {
  //   if (index !== -1 && index < 30) {
  //     setTimeout(
  //       () => {
  //         console.log("animate");
  //         setShouldAnimate(true);
  //       },
  //       (index % 42) * 60,
  //     );
  //   } else {
  //     setShouldAnimate(true);
  //   }
  // }, [index]);

  if (!dayRender.isButton) {
    return <div {...dayRender.divProps} />;
  }

  return (
    <div className="relative">
      {dayRender.activeModifiers.selected && (
        <img
          src={photo?.url + "/-/preview/100x100/"}
          alt=""
          className={`absolute left-0 top-0 h-10 w-10 rounded-full  object-cover brightness-75 filter transition-opacity duration-300
            ${index === 0 ? "ring-2 ring-black brightness-90" : ""}
            `}
          // ${shouldAnimate ? "opacity-1" : "opacity-0"}
        />
      )}
      <Button {...dayRender.buttonProps} ref={buttonRef} />
    </div>
  );
}

type CalenderPlannerProps = {
  generationProps: TimeGenerationProps;
  setSelectedDay: (date: Date) => void;
  photos: Photo[];
};

// todo If no photos, show a message to upload photos or go back to upload photos
export const CalenderPlanner = (props: CalenderPlannerProps) => {
  const { generationProps, setSelectedDay, photos } = props;

  const { startDate } = generationProps;
  const plan = planPhotoSchedule(generationProps, photos.length);

  const lastDate = plan[plan.length - 1];

  const footer = startDate ? (
    <div className="pt-4">
      <p>Sender første foto</p>
      <b>{dayjs(startDate).format("D. MMM YY")}</b>
      <p className="pt-4">Sender sidste foto</p>
      <b>{dayjs(lastDate).format("D. MMM YY")}</b>
    </div>
  ) : (
    <b className="mt-2">Vælg start dato</b>
  );

  return (
    <Card
      className="margin-left-[30px] right-[30px] inline-flex items-center"
      style={{ marginLeft: 30, right: 30 }}
    >
      <DayPicker
        fromDate={dayjs().toDate()}
        mode="multiple"
        selected={plan}
        locale={da}
        fixedWeeks
        pagedNavigation={false}
        showOutsideDays
        components={{
          Day: (props) => <DayImageViewer {...props} />,
        }}
        footer={footer}
        onDayClick={(day) => setSelectedDay(dayjs(day).toDate())}
      />
    </Card>
  );
};
