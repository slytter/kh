import dayjs from "dayjs";
import { Photo, TimeGenerationProps } from "../store/store";

// Takes in the generation_props and the number of images to be sent
// returns an array of dates for when the images will be sent
export const planPhotoSchedule = (
  generation_props: TimeGenerationProps,
  numImages: number,
): Date[] => {
  const { interval, startDate, sendHour } = generation_props;
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

export const addSendDatesToPhotos = (
  photos: Photo[],
  generation_props: TimeGenerationProps,
): Photo[] => {
  const sendDates = planPhotoSchedule(generation_props, photos.length);
  return photos.map((photo, index) => {
    return {
      ...photo,
      send_at: sendDates[index].valueOf(),
    };
  });
};
