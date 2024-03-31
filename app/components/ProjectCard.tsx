import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Link,
} from "@nextui-org/react";
import { Photo, Project } from "~/store/store";
import { ProjectDescription } from "./ProjectDescription";
import dayjs from "dayjs";
import { HorizontalPhotoOverview } from "./HorizontalPhotoOverview";

type Props = {
  project: Project;
  photos: Photo[];
};

export const ProjectCard = (props: Props) => {
  const { project, photos } = props;

  return (
    <button className="text-left">
      <Card className="max-w-[400px]">
        <CardHeader className="flex">
          <div className="flex flex-col">
            <p className="text-md">{project.name}</p>
            <p className="text-small text-default-500">
              Oprettet den {dayjs(project.created_at).format("DD. MMM")}
            </p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <HorizontalPhotoOverview photos={photos} />
        </CardBody>
        <Divider />
        <CardFooter>
          {project && <ProjectDescription project={project} photos={photos} />}
        </CardFooter>
      </Card>
    </button>
  );
};
