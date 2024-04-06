import dayjs from "dayjs";
import { Photo, Project } from "~/store/store";

type Props = {
  project: Project;
  photos?: Photo[];
};

export const ProjectDescription = (props: Props) => {
  const { project, photos } = props;

  const numPhotos = photos?.length;
  const firstPhoto = photos?.[0];
  const lastPhoto = photos?.[(numPhotos || 1) - 1];

  return (
    <p className="text-default-500">
      Email{project.receivers.length === 1 ? "" : "s"}{" "}
      <b>{project.receivers.map((receiver) => receiver).join(", ")} </b>
      modtager i alt {numPhotos} fotos.
      <br />
      Ét foto{" "}
      <b>
        hver {project.generation_props?.interval === "weekly" ? "uge" : "dag"}
      </b>{" "}
      {firstPhoto && (
        <>
          fra <b>den {dayjs(firstPhoto.send_at).format("D. MMM")}</b>
        </>
      )}
      {lastPhoto && (
        <>
          {" "}
          til den <b>{dayjs(lastPhoto.send_at).format("D. MMM - YY")}.</b>
        </>
      )}
    </p>
  );
};
