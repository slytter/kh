import dayjs from "dayjs";
import { TimeGenerationProps } from "~/store/store";

// Takes in the generationProps and the number of images to be sent
// returns an array of dates for when the images will be sent
export const planImageSchedule = (
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
