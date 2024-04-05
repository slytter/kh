import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
} from "@nextui-org/react";
import { Photo, Project } from "~/store/store";
import { ProjectDescription } from "./ProjectDescription";
import dayjs from "dayjs";
import { HorizontalPhotoOverview } from "./HorizontalPhotoOverview";
import { useState } from "react";
import { ArrowRight, SettingsIcon } from "lucide-react";

type Props = {
  project: Project;
  photos: Photo[];
  onDelete: (projectId: number) => void;
  onEdit: (projectId: number) => void;
};

export const ProjectCard = (props: Props) => {
  const { project, photos, onDelete, onEdit } = props;

  const [hover, setHover] = useState(false);

  const projectId = project.id;

  return (
    <Card className="">
      <CardHeader className="flex items-center justify-between">
        <div className="flex flex-col">
          <p className="text-md">{project.name}</p>
          <p className="text-small text-default-500">
            Oprettet den {dayjs(project.created_at).format("DD. MMM")}
          </p>
        </div>
        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly variant="bordered" aria-label="Indstillinger">
              <SettingsIcon size={20} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem
              onClick={() => {
                projectId && onEdit(projectId);
              }}
            >
              <button type="submit">Rediger projekt</button>
            </DropdownItem>
            <DropdownItem
              color={"danger"}
              className={"text-danger"}
              onClick={() => projectId && onDelete(projectId)}
            >
              <button type="submit">Slet projekt</button>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </CardHeader>
      <Divider />
      <CardBody aria-label="Dynamic Actions">
        <button
          onMouseOver={() => setHover(true)}
          onMouseOut={() => setHover(false)}
        >
          <HorizontalPhotoOverview photos={photos} height={hover ? 100 : 60} />
        </button>
      </CardBody>
      <Divider />
      <CardFooter className="justify-between">
        {project && (
          <>
            <p className="text-sm">Modtager: {project.receivers}</p>
          </>
        )}
        <Button
          size="sm"
          variant="solid"
          // color="secondary"
          onClick={() => props.project.id && props.onEdit(props.project.id)}
          endContent={<ArrowRight size={16} />}
        >
          Rediger
        </Button>
      </CardFooter>
    </Card>
  );
};
